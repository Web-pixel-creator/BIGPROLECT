import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { createDataStream, generateId } from 'ai';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS, type FileMap } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/common/prompts/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';
import type { IProviderSetting } from '~/types/model';
import { createScopedLogger } from '~/utils/logger';
import { getFilePaths, selectContext } from '~/lib/.server/llm/select-context';
import type { ContextAnnotation, ProgressAnnotation } from '~/types/context';
import { WORK_DIR } from '~/utils/constants';
import { createSummary } from '~/lib/.server/llm/create-summary';
import { extractPropertiesFromMessage } from '~/lib/.server/llm/utils';
import type { DesignScheme } from '~/types/design-scheme';
import { MCPService } from '~/lib/services/mcpService';
import { StreamRecoveryManager } from '~/lib/.server/llm/stream-recovery';
import { componentMatcher } from '~/lib/services/componentMatcher.server';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

const logger = createScopedLogger('api.chat');

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  const items = cookieHeader.split(';').map((cookie) => cookie.trim());

  items.forEach((item) => {
    const [name, ...rest] = item.split('=');

    if (name && rest) {
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

function normalizePathForMatch(path: string): string {
  return (path || '').replace(/\\/g, '/');
}

function getMessageTextContent(message: Messages[number] | undefined): string {
  if (!message) {
    return '';
  }

  const content: any = (message as any).content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter((item) => item && item.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text)
      .join('');
  }

  return '';
}

function stripPromptMeta(input: string): string {
  return input
    .replace(/\[Model:[^\]]+\]\s*/gi, '')
    .replace(/\[Provider:[^\]]+\]\s*/gi, '')
    .trim();
}

function isDesignPrompt(input: string): boolean {
  const lower = input.toLowerCase();
  const keywords = [
    'website',
    'site',
    'landing',
    'landing page',
    'web page',
    'homepage',
    'page',
    'layout',
    'design',
    'ui',
    'interface',
    'hero',
    'section',
    'mockup',
    'prototype',
    'wireframe',
    'сайт',
    'лендинг',
    'главная',
    'страница',
    'дизайн',
    'интерфейс',
    'секция',
    'экран',
    'макет',
    'прототип',
  ];

  return keywords.some((keyword) => lower.includes(keyword));
}

function appendContextToMessage(message: Messages[number], context: string): Messages[number] {
  if (!context.trim()) {
    return message;
  }

  const content: any = (message as any).content;

  if (typeof content === 'string') {
    return { ...message, content: `${content}\n\n${context}` };
  }

  if (Array.isArray(content)) {
    return {
      ...message,
      content: [
        ...content,
        {
          type: 'text',
          text: `\n\n${context}`,
        },
      ],
    };
  }

  return { ...message, content: `${String(content ?? '')}\n\n${context}` };
}

function appendContextToLastUserMessage(messages: Messages, context: string): Messages {
  const lastIndex = [...messages].reduce((last, message, index) => {
    return message.role === 'user' ? index : last;
  }, -1);

  if (lastIndex < 0) {
    return messages;
  }

  const next = [...messages];
  next[lastIndex] = appendContextToMessage(next[lastIndex], context);
  return next;
}

function heuristicSelectContextFiles(args: {
  files: FileMap;
  filePaths: string[];
  userPrompt: string;
  maxFiles: number;
}): FileMap {
  const { files, filePaths, userPrompt, maxFiles } = args;

  const workDirPrefix = `${normalizePathForMatch(WORK_DIR).replace(/\/+$/g, '')}/`;
  const normalizedFullPaths = filePaths.map(normalizePathForMatch);

  const pickFullByEndsWith = (suffixes: string[]): string | undefined => {
    for (const suffix of suffixes) {
      const target = `${workDirPrefix}${suffix}`.toLowerCase();
      const found = normalizedFullPaths.find((p) => p.toLowerCase() === target);

      if (found) {
        return found;
      }
    }
    return undefined;
  };

  const pickFullByNameIncludes = (needles: string[]): string | undefined => {
    const lowerNeedles = needles.map((n) => n.toLowerCase());
    const found = normalizedFullPaths.find((p) => {
      const fileName = p.split('/').pop() ?? p;
      const lowerName = fileName.toLowerCase();

      return lowerNeedles.some((n) => lowerName.includes(n));
    });

    return found;
  };

  const picked = new Set<string>();
  const add = (fullPath: string | undefined) => {
    if (!fullPath) {
      return;
    }

    if (picked.size >= maxFiles) {
      return;
    }

    picked.add(fullPath);
  };

  // Always-valuable project files
  add(pickFullByEndsWith(['package.json']));
  add(pickFullByEndsWith(['src/App.tsx', 'src/app.tsx', 'src/main.tsx']));
  add(pickFullByEndsWith(['src/lib/utils.ts']));

  if (/\b(css|tailwind|style|стил|цвет|theme)\b/i.test(userPrompt)) {
    add(pickFullByEndsWith(['src/index.css', 'src/App.css']));
    add(pickFullByEndsWith(['tailwind.config.ts', 'tailwind.config.js', 'postcss.config.js', 'postcss.config.cjs']));
  }

  if (/\b(vite|alias|tsconfig|path)\b/i.test(userPrompt)) {
    add(pickFullByEndsWith(['vite.config.ts', 'vite.config.js', 'tsconfig.json']));
  }

  // Section-driven component files (best-effort)
  const wantsHeader = /\b(header|navbar|nav|menu|top\s*bar|шапк|меню|навигац)\b/i.test(userPrompt);
  const wantsFooter = /\bfooter|подвал\b/i.test(userPrompt);
  const wantsProducts = /\b(product|products|catalog|grid|bestseller|товар|каталог|сетк|карточк)\b/i.test(userPrompt);
  const wantsCategories = /\b(category|categories|seating|tables|storage|категор)\b/i.test(userPrompt);

  if (wantsHeader) {
    add(pickFullByNameIncludes(['header', 'navbar', 'nav']));
  }

  if (wantsFooter) {
    add(pickFullByNameIncludes(['footer']));
  }

  if (wantsProducts) {
    add(pickFullByNameIncludes(['product', 'grid', 'bestseller']));
  }

  if (wantsCategories) {
    add(pickFullByNameIncludes(['category', 'categories']));
  }

  // Fallback: include a few TS/TSX files from src if we still have budget.
  if (picked.size === 0) {
    for (const fullPath of normalizedFullPaths) {
      if (picked.size >= maxFiles) {
        break;
      }

      if (!fullPath.includes('/src/')) {
        continue;
      }

      if (!/\.(tsx|ts)$/.test(fullPath)) {
        continue;
      }

      picked.add(fullPath);
    }
  }

  const result: FileMap = {};

  for (const fullPath of picked) {
    const rel = fullPath.toLowerCase().startsWith(workDirPrefix.toLowerCase())
      ? fullPath.slice(workDirPrefix.length)
      : fullPath;
    const dirent = files[fullPath] ?? files[`${WORK_DIR}/${rel}`];

    if (!dirent) {
      continue;
    }

    result[rel] = dirent;
  }

  return result;
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const streamRecovery = new StreamRecoveryManager({
    timeout: 45000,
    maxRetries: 2,
    onTimeout: () => {
      logger.warn('Stream timeout - attempting recovery');
    },
  });

  const { messages, files, promptId, contextOptimization, modularGeneration, supabase, chatMode, designScheme, maxLLMSteps } =
    await request.json<{
      messages: Messages;
      files: any;
      promptId?: string;
      contextOptimization: boolean;
      modularGeneration?: boolean;
      chatMode: 'discuss' | 'build';
      designScheme?: DesignScheme;
      supabase?: {
        isConnected: boolean;
        hasSelectedProject: boolean;
        credentials?: {
          anonKey?: string;
          supabaseUrl?: string;
        };
      };
      maxLLMSteps: number;
    }>();

  const cookieHeader = request.headers.get('Cookie');
  const apiKeys = JSON.parse(parseCookies(cookieHeader || '').apiKeys || '{}');
  const providerSettings: Record<string, IProviderSetting> = JSON.parse(
    parseCookies(cookieHeader || '').providers || '{}',
  );

  const stream = new SwitchableStream();

  const cumulativeUsage = {
    completionTokens: 0,
    promptTokens: 0,
    totalTokens: 0,
  };
  const encoder: TextEncoder = new TextEncoder();
  let progressCounter: number = 1;

  try {
    const mcpService = MCPService.getInstance();
    const totalMessageContent = messages.reduce((acc, message) => acc + message.content, '');
    logger.debug(`Total message length: ${totalMessageContent.split(' ').length}, words`);

    let lastChunk: string | undefined = undefined;

    const dataStream = createDataStream({
      async execute(dataStream) {
        streamRecovery.startMonitoring();

        const filePaths = getFilePaths(files || {});
        let filteredFiles: FileMap | undefined = undefined;
        let summary: string | undefined = undefined;
        let messageSliceId = 0;

        let processedMessages = await mcpService.processToolInvocations(messages, dataStream);

        const lastUserMessage = [...processedMessages].reverse().find((message) => message.role === 'user');
        const selectedMeta = lastUserMessage ? extractPropertiesFromMessage(lastUserMessage) : undefined;
        const selectedProvider = selectedMeta?.provider;
        const selectedModel = selectedMeta?.model;
        const isGoogleProvider =
          (selectedProvider || '').toLowerCase() === 'google' ||
          Boolean(selectedModel && /gemini/i.test(selectedModel));

        const isModelScopeProvider =
          (selectedProvider || '').toLowerCase() === 'modelscope' ||
          Boolean(
            selectedModel &&
              (/qwen/i.test(selectedModel) || /deepseek/i.test(selectedModel) || selectedModel.startsWith('iic/')),
          );

        if (processedMessages.length > 3) {
          messageSliceId = processedMessages.length - 3;
        }

        if (filePaths.length > 0 && contextOptimization) {
          /*
           * Google is particularly sensitive to RPM/TPM quotas. Summary + context-selection are extra LLM calls
           * that often cause the *second* user prompt to hit rate limits. For Google, use a fast heuristic
           * selector and skip summary/context LLM calls to keep a single LLM request per user prompt.
           */
          if (isGoogleProvider) {
            logger.debug('Skipping createSummary/selectContext for Google (heuristic context selection)');
            dataStream.writeData({
              type: 'progress',
              label: 'context',
              status: 'in-progress',
              order: progressCounter++,
              message: 'Selecting Relevant Files',
            } satisfies ProgressAnnotation);

            const promptText = getMessageTextContent(lastUserMessage);
            filteredFiles = heuristicSelectContextFiles({
              files,
              filePaths,
              userPrompt: promptText,
              maxFiles: 4,
            });

            const contextKeys = Object.keys(filteredFiles || {});

            if (contextKeys.length) {
              logger.debug(`heuristic files in context : ${JSON.stringify(contextKeys)}`);

              dataStream.writeMessageAnnotation({
                type: 'codeContext',
                files: contextKeys,
              } as ContextAnnotation);
            }

            dataStream.writeData({
              type: 'progress',
              label: 'context',
              status: 'complete',
              order: progressCounter++,
              message: 'Code Files Selected',
            } satisfies ProgressAnnotation);
          } else {
            console.log(`Messages count: ${processedMessages.length}`);
            logger.info(`Extracting context using provider: ${selectedProvider}, model: ${selectedModel}`);

            try {
              summary = await createSummary({
                messages: [...processedMessages],
                env: context.cloudflare?.env,
                apiKeys,
                providerSettings,
                promptId,
                contextOptimization,
                onFinish(resp) {
                  if (resp.usage) {
                    logger.debug('createSummary token usage', JSON.stringify(resp.usage));
                    cumulativeUsage.completionTokens += resp.usage.completionTokens || 0;
                    cumulativeUsage.promptTokens += resp.usage.promptTokens || 0;
                    cumulativeUsage.totalTokens += resp.usage.totalTokens || 0;
                  }
                },
              });
            } catch (err) {
              logger.error('createSummary failed, skipping summary optimization:', err);
            }
            dataStream.writeData({
              type: 'progress',
              label: 'summary',
              status: 'complete',
              order: progressCounter++,
              message: 'Analysis Complete',
            } satisfies ProgressAnnotation);

            dataStream.writeMessageAnnotation({
              type: 'chatSummary',
              summary,
              chatId: processedMessages.slice(-1)?.[0]?.id,
            } as ContextAnnotation);

            // Update context buffer
            logger.debug('Updating Context Buffer');
            dataStream.writeData({
              type: 'progress',
              label: 'context',
              status: 'in-progress',
              order: progressCounter++,
              message: 'Determining Files to Read',
            } satisfies ProgressAnnotation);

            // Select context files
            console.log(`Messages count: ${processedMessages.length}`);

            try {
              filteredFiles = await selectContext({
                messages: [...processedMessages],
                env: context.cloudflare?.env,
                apiKeys,
                files,
                providerSettings,
                promptId,
                contextOptimization,
                summary: summary || '',
                onFinish(resp) {
                  if (resp.usage) {
                    logger.debug('selectContext token usage', JSON.stringify(resp.usage));
                    cumulativeUsage.completionTokens += resp.usage.completionTokens || 0;
                    cumulativeUsage.promptTokens += resp.usage.promptTokens || 0;
                    cumulativeUsage.totalTokens += resp.usage.totalTokens || 0;
                  }
                },
              });
            } catch (err) {
              logger.error('selectContext failed, skipping file filtering optimization:', err);
              filteredFiles = {}; // Fallback to no files or handle as needed
            }

            if (filteredFiles) {
              logger.debug(`files in context : ${JSON.stringify(Object.keys(filteredFiles))}`);
            }

            dataStream.writeMessageAnnotation({
              type: 'codeContext',
              files: Object.keys(filteredFiles).map((key) => {
                let path = key;

                if (path.startsWith(WORK_DIR)) {
                  path = path.replace(WORK_DIR, '');
                }

                return path;
              }),
            } as ContextAnnotation);

            dataStream.writeData({
              type: 'progress',
              label: 'context',
              status: 'complete',
              order: progressCounter++,
              message: 'Code Files Selected',
            } satisfies ProgressAnnotation);

            // logger.debug('Code Files Selected');
          }
        }

        let componentContext = '';
        if (chatMode === 'build') {
          const lastUserMessageForComponents = [...processedMessages]
            .reverse()
            .find((message) => message.role === 'user');
          const rawPrompt = stripPromptMeta(getMessageTextContent(lastUserMessageForComponents));

          if (rawPrompt && isDesignPrompt(rawPrompt)) {
            try {
              await componentMatcher.loadAllComponentFiles();
              componentContext = componentMatcher.generateContextForPrompt(rawPrompt, 5);
            } catch (error) {
              logger.warn('Failed to build component matcher context', { error });
              componentContext = '';
            }
          }
        }

        if (componentContext) {
          processedMessages = appendContextToLastUserMessage(processedMessages, componentContext);
        }

        const options: StreamingOptions = {
          supabaseConnection: supabase,
          toolChoice: 'auto',
          tools: mcpService.toolsWithoutExecute,
          maxSteps: maxLLMSteps,
          onStepFinish: ({ toolCalls }) => {
            // add tool call annotations for frontend processing
            toolCalls.forEach((toolCall) => {
              mcpService.processToolCall(toolCall, dataStream);
            });
          },
          onFinish: async ({ text: content, finishReason, usage }) => {
            logger.debug('usage', JSON.stringify(usage));

            if (usage) {
              cumulativeUsage.completionTokens += usage.completionTokens || 0;
              cumulativeUsage.promptTokens += usage.promptTokens || 0;
              cumulativeUsage.totalTokens += usage.totalTokens || 0;
            }

            if (finishReason !== 'length') {
              dataStream.writeMessageAnnotation({
                type: 'usage',
                value: {
                  completionTokens: cumulativeUsage.completionTokens,
                  promptTokens: cumulativeUsage.promptTokens,
                  totalTokens: cumulativeUsage.totalTokens,
                },
              });
              dataStream.writeData({
                type: 'progress',
                label: 'response',
                status: 'complete',
                order: progressCounter++,
                message: 'Response Generated',
              } satisfies ProgressAnnotation);
              await new Promise((resolve) => setTimeout(resolve, 0));

              // stream.close();
              return;
            }

            if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
              throw Error('Cannot continue message: Maximum segments reached');
            }

            const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

            logger.info(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

            const lastUserMessage = processedMessages.filter((x) => x.role == 'user').slice(-1)[0];
            const { model, provider } = extractPropertiesFromMessage(lastUserMessage);
            processedMessages.push({ id: generateId(), role: 'assistant', content });
            processedMessages.push({
              id: generateId(),
              role: 'user',
              content: `[Model: ${model}]\n\n[Provider: ${provider}]\n\n${CONTINUE_PROMPT}`,
            });

            const result = await streamText({
              messages: [...processedMessages],
              env: context.cloudflare?.env,
              options,
              apiKeys,
              files,
              providerSettings,
              promptId,
              contextOptimization,
              modularGeneration,
              contextFiles: filteredFiles,
              chatMode,
              designScheme,
              summary,
              messageSliceId,
            });

            if (result) {
              result.mergeIntoDataStream(dataStream);

              (async () => {
                for await (const part of result.fullStream) {
                  if (part.type === 'error') {
                    const error: any = part.error;
                    logger.error(`${error}`);

                    return;
                  }
                }
              })();
            }

            return;
          },
        };

        dataStream.writeData({
          type: 'progress',
          label: 'response',
          status: 'in-progress',
          order: progressCounter++,
          message: 'Generating Response',
        } satisfies ProgressAnnotation);

        const result = await streamText({
          messages: [...processedMessages],
          env: context.cloudflare?.env,
          options,
          apiKeys,
          files,
          providerSettings,
          promptId,
          contextOptimization,
          modularGeneration,
          contextFiles: filteredFiles,
          chatMode,
          designScheme,
          summary,
          messageSliceId,
        });

        (async () => {
          for await (const part of result.fullStream) {
            streamRecovery.updateActivity();

            if (part.type === 'error') {
              const error: any = part.error;
              logger.error('Streaming error:', error);
              streamRecovery.stop();

              // Enhanced error handling for common streaming issues
              if (error.message?.includes('Invalid JSON response')) {
                logger.error('Invalid JSON response detected - likely malformed API response');
              } else if (error.message?.includes('token')) {
                logger.error('Token-related error detected - possible token limit exceeded');
              }

              return;
            }
          }
          streamRecovery.stop();
        })();

        if (result) {
          result.mergeIntoDataStream(dataStream);
        }
      },
      onError: (error: any) => {
        // Provide more specific error messages for common issues
        console.error('LLM Provider Error:', error);

        const errorMessage = error.message || 'Unknown error';
        const lowerErrorMessage = typeof errorMessage === 'string' ? errorMessage.toLowerCase() : '';

        if (errorMessage.includes('model') && errorMessage.includes('not found')) {
          return 'Custom error: Invalid model selected. Please check that the model name is correct and available.';
        }

        if (lowerErrorMessage.includes('alibaba cloud account')) {
          return 'Custom error: Please bind your Alibaba Cloud account to use ModelScope inference. Visit https://modelscope.cn/my/overview to link your account.';
        }

        if (errorMessage.includes('Invalid JSON response')) {
          return 'Custom error: The AI service returned an invalid response. This may be due to an invalid model name, API rate limiting, or server issues. Try selecting a different model or check your API key.';
        }

        if (
          lowerErrorMessage.includes('invalid_type') &&
          lowerErrorMessage.includes('candidates') &&
          lowerErrorMessage.includes('content') &&
          lowerErrorMessage.includes('parts')
        ) {
          return 'Custom error: The AI provider returned an empty response (missing content parts). Please retry or switch models.';
        }

        if (
          lowerErrorMessage.includes('api key') ||
          lowerErrorMessage.includes('unauthorized') ||
          lowerErrorMessage.includes('authentication')
        ) {
          return 'Custom error: Invalid or missing API key. Please check your API key configuration.';
        }

        // Quota / rate limiting (Gemini often reports this without the words "rate limit" or the "429" string)
        if (
          lowerErrorMessage.includes('quota') ||
          lowerErrorMessage.includes('resource_exhausted') ||
          lowerErrorMessage.includes('too many requests') ||
          lowerErrorMessage.includes('requests per minute') ||
          lowerErrorMessage.includes('tokensperminute') ||
          lowerErrorMessage.includes('tokens per minute')
        ) {
          return 'Custom error: API quota/rate limit exceeded. Please wait a moment and try again, or check billing/quotas for the selected provider/model.';
        }

        if (errorMessage.includes('token') && errorMessage.includes('limit')) {
          return 'Custom error: Token limit exceeded. The conversation is too long for the selected model. Try using a model with larger context window or start a new conversation.';
        }

        if (lowerErrorMessage.includes('rate limit') || lowerErrorMessage.includes('429')) {
          return 'Custom error: API rate limit exceeded. Please wait a moment before trying again.';
        }

        if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
          return 'Custom error: Network error. Please check your internet connection and try again.';
        }

        return `Custom error: ${errorMessage}`;
      },
    }).pipeThrough(
      new TransformStream({
        transform: (chunk, controller) => {
          if (!lastChunk) {
            lastChunk = ' ';
          }

          if (typeof chunk === 'string') {
            if (chunk.startsWith('g') && !lastChunk.startsWith('g')) {
              controller.enqueue(encoder.encode(`0: "<div class=\\"__boltThought__\\">"\n`));
            }

            if (lastChunk.startsWith('g') && !chunk.startsWith('g')) {
              controller.enqueue(encoder.encode(`0: "</div>\\n"\n`));
            }
          }

          lastChunk = chunk;

          let transformedChunk = chunk;

          if (typeof chunk === 'string' && chunk.startsWith('g')) {
            let content = chunk.split(':').slice(1).join(':');

            if (content.endsWith('\n')) {
              content = content.slice(0, content.length - 1);
            }

            transformedChunk = `0:${content}\n`;
          }

          // Convert the string stream to a byte stream
          const str = typeof transformedChunk === 'string' ? transformedChunk : JSON.stringify(transformedChunk);
          controller.enqueue(encoder.encode(str));
        },
      }),
    );

    return new Response(dataStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Text-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    logger.error(error);

    const errorResponse = {
      error: true,
      message: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500,
      isRetryable: error.isRetryable !== false, // Default to retryable unless explicitly false
      provider: error.provider || 'unknown',
    };

    if (error.message?.includes('API key')) {
      return new Response(
        JSON.stringify({
          ...errorResponse,
          message: 'Invalid or missing API key',
          statusCode: 401,
          isRetryable: false,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          statusText: 'Unauthorized',
        },
      );
    }

    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode,
      headers: { 'Content-Type': 'application/json' },
      statusText: 'Error',
    });
  }
}
