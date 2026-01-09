import { useStore } from '@nanostores/react';
import type { Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useAnimate } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useMessageParser, usePromptEnhancer, useShortcuts } from '~/lib/hooks';
import { description, useChatHistory } from '~/lib/persistence';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, PROMPT_COOKIE_KEY, PROVIDER_LIST } from '~/utils/constants';
import { cubicEasingFn } from '~/utils/easings';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { BaseChat } from './BaseChat';
import Cookies from 'js-cookie';
import { debounce } from '~/utils/debounce';
import { useSettings } from '~/lib/hooks/useSettings';
import type { ProviderInfo } from '~/types/model';
import { useSearchParams } from '@remix-run/react';
import { createSampler } from '~/utils/sampler';
import { getTemplates, selectStarterTemplate } from '~/utils/selectStarterTemplate';
import { logStore } from '~/lib/stores/logs';
import { enhancePromptWithDesignSystem, shouldEnhancePrompt, type EnhancedPrompt } from '~/lib/services/promptEnhancer';
import { streamingState } from '~/lib/stores/streaming';
import { filesToArtifacts } from '~/utils/fileUtils';
import { supabaseConnection } from '~/lib/stores/supabase';
import { defaultDesignScheme, type DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import type { TextUIPart, FileUIPart, Attachment } from '@ai-sdk/ui-utils';
import { useMCPStore } from '~/lib/stores/mcp';
import type { LlmErrorAlertType } from '~/types/actions';
import { createLayoutSeed, generateLayoutStrategy, getLayoutInstructions } from '~/lib/services/layout-mutator';
import type { GenerationSummary } from './GenerationSummaryCard';

const logger = createScopedLogger('Chat');
const STREAM_STALL_MS = 60000;
const STREAM_STALL_CHECK_MS = 5000;

const decodePromptValue = (value: string): string => {
  if (!value || !/%[0-9A-Fa-f]{2}/.test(value)) {
    return value;
  }

  try {
    const decoded = decodeURIComponent(value.replace(/\+/g, ' '));
    return decoded !== value ? decoded : value;
  } catch {
    return value;
  }
};

const THEME_SUMMARIES: Record<string, { intro: string; colors: string; typography: string; animations: string }> = {
  food: {
    intro: 'a warm, appetizing meal kit homepage inspired by modern meal services.',
    colors: 'Warm coral primary, sage green accent, cream backgrounds',
    typography: 'Display serif headings with clean sans-serif body',
    animations: 'Gentle fade-ins, hover lifts, smooth transitions',
  },
  vinyl: {
    intro: 'a vintage vinyl marketplace with gold and cream accents on deep charcoal.',
    colors: 'Deep charcoal base with gold and cream accents',
    typography: 'Elegant display serif with condensed accents',
    animations: 'Subtle glows, hover lifts, smooth transitions',
  },
  default: {
    intro: 'a high-quality landing page tailored to the prompt.',
    colors: 'Balanced palette aligned to the prompt',
    typography: 'Strong display headings with clean body text',
    animations: 'Gentle fade-ins, hover lifts, smooth transitions',
  },
};

function extractBrandNameFromPrompt(prompt: string): string | null {
  const match = prompt.match(/(?:called|named)\s+["'`“”]?([^"'`\n]{2,40})["'`“”]?/i);

  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

function extractSectionsFromPrompt(prompt: string): string[] {
  const lines = prompt
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = lines
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, ''))
    .filter((line) => !/^design style|^design system|^style:/i.test(line));

  const seen = new Set<string>();
  const unique: string[] = [];

  for (const section of sections) {
    const key = section.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(section);
  }

  return unique.slice(0, 8);
}

function buildGenerationSummary(prompt: string, enhanced?: EnhancedPrompt): GenerationSummary {
  const theme = enhanced?.detectedTheme || 'default';
  const themeSummary = THEME_SUMMARIES[theme] || THEME_SUMMARIES.default;
  const brandName = extractBrandNameFromPrompt(prompt) || 'your project';

  const colors = enhanced?.colors;
  const colorLine = colors
    ? `${themeSummary.colors} (${colors.dark}, ${colors.light}, ${colors.accent})`
    : themeSummary.colors;

  const sectionsFromContract =
    enhanced?.sectionContract?.order?.map((section) => {
      const labels = enhanced.sectionContract?.labels || {};
      return labels[section] || section;
    }) || [];

  const sections = sectionsFromContract.length > 0 ? sectionsFromContract : extractSectionsFromPrompt(prompt);

  return {
    title: `Building ${brandName} - ${themeSummary.intro}`,
    designSystem: {
      colors: colorLine,
      typography: themeSummary.typography,
      animations: themeSummary.animations,
    },
    sections,
  };
}

export function Chat() {
  renderLogger.trace('Chat');

  const { ready, initialMessages, storeMessageHistory, importChat, exportChat } = useChatHistory();
  const title = useStore(description);
  useEffect(() => {
    workbenchStore.setReloadedMessages(initialMessages.map((m) => m.id));
  }, [initialMessages]);

  return (
    <>
      {ready && (
        <ChatImpl
          description={title}
          initialMessages={initialMessages}
          exportChat={exportChat}
          storeMessageHistory={storeMessageHistory}
          importChat={importChat}
        />
      )}
    </>
  );
}

const processSampledMessages = createSampler(
  (options: {
    messages: Message[];
    initialMessages: Message[];
    isLoading: boolean;
    parseMessages: (messages: Message[], isLoading: boolean) => void;
    storeMessageHistory: (messages: Message[]) => Promise<void>;
  }) => {
    const { messages, initialMessages, isLoading, parseMessages, storeMessageHistory } = options;
    parseMessages(messages, isLoading);

    if (messages.length > initialMessages.length) {
      storeMessageHistory(messages).catch((error) => toast.error(error.message));
    }
  },
  500,
);

interface ChatProps {
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
  importChat: (description: string, messages: Message[]) => Promise<void>;
  exportChat: () => void;
  description?: string;
}

export const ChatImpl = memo(
  ({ description, initialMessages, storeMessageHistory, importChat, exportChat }: ChatProps) => {
    useShortcuts();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imageDataList, setImageDataList] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fakeLoading, setFakeLoading] = useState(false);
    const [files, setFiles] = useState(() => workbenchStore.files.get());
    const [designScheme, setDesignScheme] = useState<DesignScheme>(defaultDesignScheme);
    const actionAlert = useStore(workbenchStore.alert);
    const deployAlert = useStore(workbenchStore.deployAlert);
    const supabaseConn = useStore(supabaseConnection);
    const selectedProject = supabaseConn.stats?.projects?.find(
      (project) => project.id === supabaseConn.selectedProjectId,
    );
    const supabaseAlert = useStore(workbenchStore.supabaseAlert);
    const { activeProviders, promptId, autoSelectTemplate, contextOptimizationEnabled, autoFixValidationEnabled } =
      useSettings();
    const [llmErrorAlert, setLlmErrorAlert] = useState<LlmErrorAlertType | undefined>(undefined);
    const [model, setModel] = useState(() => {
      const savedModel = Cookies.get('selectedModel');
      return savedModel || DEFAULT_MODEL;
    });
    const [provider, setProvider] = useState(() => {
      const savedProvider = Cookies.get('selectedProvider');
      return (PROVIDER_LIST.find((p) => p.name === savedProvider) || DEFAULT_PROVIDER) as ProviderInfo;
    });
    const { showChat } = useStore(chatStore);
    const [animationScope, animate] = useAnimate();
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
    const [chatMode, setChatMode] = useState<'discuss' | 'build'>('build');
    const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
    const [generationSummary, setGenerationSummary] = useState<GenerationSummary | null>(null);
    const mcpSettings = useMCPStore((state) => state.settings);
    const autoFixKeysRef = useRef<Set<string>>(new Set());

    const streamThrottle =
      provider?.name?.toLowerCase() === 'mistral' || model?.toLowerCase().includes('mistral') ? 1200 : 500;

    const {
      messages,
      isLoading,
      input,
      handleInputChange,
      setInput,
      stop,
      append,
      setMessages,
      reload,
      error,
      data: chatData,
      setData,
      addToolResult,
    } = useChat({
      api: '/api/chat',
      experimental_throttle: streamThrottle,
      body: {
        apiKeys,
        files,
        promptId,
        contextOptimization: contextOptimizationEnabled,
        chatMode,
        designScheme,
        supabase: {
          isConnected: supabaseConn.isConnected,
          hasSelectedProject: !!selectedProject,
          credentials: {
            supabaseUrl: supabaseConn?.credentials?.supabaseUrl,
            anonKey: supabaseConn?.credentials?.anonKey,
          },
        },
        maxLLMSteps: mcpSettings.maxLLMSteps,
      },
      sendExtraMessageFields: true,
      onError: (e) => {
        setFakeLoading(false);
        workbenchStore.clearPendingSectionContract();
        handleError(e, 'chat');
      },
      onFinish: (message, response) => {
        const usage = response.usage;
        setData(undefined);
        workbenchStore.clearPendingSectionContract();

        if (usage) {
          console.log('Token usage:', usage);
          logStore.logProvider('Chat response completed', {
            component: 'Chat',
            action: 'response',
            model,
            provider: provider.name,
            usage,
            messageLength: message.content.length,
          });
        }

        logger.debug('Finished streaming');
      },
      initialMessages,
      initialInput: decodePromptValue(Cookies.get(PROMPT_COOKIE_KEY) || ''),
    });
    useEffect(() => {
      if (!isLoading) {
        setFiles(workbenchStore.files.get());
      }
    }, [isLoading]);

    useEffect(() => {
      const unsubscribe = workbenchStore.files.subscribe((nextFiles) => {
        if (isLoading) {
          return;
        }

        setFiles(nextFiles);
      });

      return () => {
        unsubscribe();
      };
    }, [isLoading]);
    useEffect(() => {
      const rawPrompt = searchParams.get('prompt');
      const prompt = rawPrompt ? decodePromptValue(rawPrompt) : '';

      // console.log(prompt, searchParams, model, provider);

      if (prompt) {
        setSearchParams({});
        runAnimation();
        append({
          role: 'user',
          content: `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${prompt}`,
        });
      }
    }, [model, provider, searchParams]);

    const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer();
    const { parsedMessages, parseMessages } = useMessageParser();
    const isStreaming = isLoading || fakeLoading;
    const [renderMessages, setRenderMessages] = useState<Message[]>(() => initialMessages);
    const renderMessagesRef = useRef<Message[]>(initialMessages);
    const [renderData, setRenderData] = useState<typeof chatData>(chatData);
    const pendingDataRef = useRef<typeof chatData>(chatData);
    const dataTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastStreamActivityRef = useRef(Date.now());
    const streamStallTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const applyParsedMessages = useCallback(
      (sourceMessages: Message[]) =>
        sourceMessages.map((message, index) => {
          if (message.role === 'user') {
            return message;
          }

          const parsed = parsedMessages[index];

          if (typeof parsed !== 'string') {
            return message;
          }

          if (message.content === parsed) {
            return message;
          }

          return {
            ...message,
            content: parsed,
          };
        }),
      [parsedMessages],
    );

    const updateRenderMessages = useCallback((nextMessages: Message[]) => {
      renderMessagesRef.current = nextMessages;
      setRenderMessages(nextMessages);
    }, []);

    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    useEffect(() => {
      chatStore.setKey('started', initialMessages.length > 0);
    }, []);

    const wasBusyRef = useRef(isStreaming);
    useEffect(() => {
      const wasBusy = wasBusyRef.current;
      const isBusy = isStreaming;

      if (wasBusy && !isBusy) {
        setGenerationSummary(null);
      }

      wasBusyRef.current = isBusy;
    }, [isStreaming]);

    useEffect(() => {
      processSampledMessages({
        messages,
        initialMessages,
        isLoading,
        parseMessages,
        storeMessageHistory,
      });
    }, [messages, isLoading, parseMessages]);

    useEffect(() => {
      if (messages.length === 0) {
        if (renderMessagesRef.current.length !== 0) {
          updateRenderMessages([]);
        }

        return;
      }

      if (!isStreaming) {
        updateRenderMessages(applyParsedMessages(messages));
        return;
      }

      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.role === 'user') {
        updateRenderMessages(applyParsedMessages(messages));
      }
    }, [applyParsedMessages, isStreaming, messages, updateRenderMessages]);

    useEffect(() => {
      pendingDataRef.current = chatData;

      if (!isStreaming) {
        if (dataTimerRef.current) {
          clearTimeout(dataTimerRef.current);
          dataTimerRef.current = null;
        }

        setRenderData(chatData);

        return;
      }

      if (dataTimerRef.current) {
        return;
      }

      dataTimerRef.current = setTimeout(() => {
        dataTimerRef.current = null;
        setRenderData(pendingDataRef.current);
      }, 600);
    }, [chatData, isStreaming]);

    useEffect(() => {
      if (isStreaming) {
        lastStreamActivityRef.current = Date.now();
      }
    }, [chatData, isStreaming, messages]);

    const scrollTextArea = () => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    };

    const abort = () => {
      stop();
      setFakeLoading(false);
      setData(undefined);
      chatStore.setKey('aborted', true);
      workbenchStore.abortAllActions();
      workbenchStore.clearPendingSectionContract();

      logStore.logProvider('Chat response aborted', {
        component: 'Chat',
        action: 'abort',
        model,
        provider: provider.name,
      });
    };

    useEffect(() => {
      if (!isStreaming) {
        if (streamStallTimerRef.current) {
          clearInterval(streamStallTimerRef.current);
          streamStallTimerRef.current = null;
        }

        return;
      }

      if (streamStallTimerRef.current) {
        return;
      }

      streamStallTimerRef.current = setInterval(() => {
        const idleFor = Date.now() - lastStreamActivityRef.current;

        if (idleFor < STREAM_STALL_MS) {
          return;
        }

        abort();
        toast.error('Stream stalled. Stopped response. Please retry or switch model.');
      }, STREAM_STALL_CHECK_MS);

      return () => {
        if (streamStallTimerRef.current) {
          clearInterval(streamStallTimerRef.current);
          streamStallTimerRef.current = null;
        }
      };
    }, [abort, isStreaming]);

    const handleError = useCallback(
      (error: any, context: 'chat' | 'template' | 'llmcall' = 'chat') => {
        logger.error(`${context} request failed`, error);

        stop();
        setFakeLoading(false);

        let errorInfo = {
          message: 'An unexpected error occurred',
          isRetryable: true,
          statusCode: 500,
          provider: provider.name,
          type: 'unknown' as const,
          retryDelay: 0,
        };

        if (error.message) {
          try {
            const parsed = JSON.parse(error.message);

            if (parsed.error || parsed.message) {
              errorInfo = { ...errorInfo, ...parsed };
            } else {
              errorInfo.message = error.message;
            }
          } catch {
            errorInfo.message = error.message;
          }
        }

        let errorType: LlmErrorAlertType['errorType'] = 'unknown';
        let title = 'Request Failed';

        if (errorInfo.statusCode === 401 || errorInfo.message.toLowerCase().includes('api key')) {
          errorType = 'authentication';
          title = 'Authentication Error';
        } else if (errorInfo.statusCode === 429 || errorInfo.message.toLowerCase().includes('rate limit')) {
          errorType = 'rate_limit';
          title = 'Rate Limit Exceeded';
        } else if (errorInfo.message.toLowerCase().includes('quota')) {
          errorType = 'quota';
          title = 'Quota Exceeded';
        } else if (errorInfo.statusCode >= 500) {
          errorType = 'network';
          title = 'Server Error';
        }

        logStore.logError(`${context} request failed`, error, {
          component: 'Chat',
          action: 'request',
          error: errorInfo.message,
          context,
          retryable: errorInfo.isRetryable,
          errorType,
          provider: provider.name,
        });

        // Create API error alert
        setLlmErrorAlert({
          type: 'error',
          title,
          description: errorInfo.message,
          provider: provider.name,
          errorType,
        });
        setData([]);
      },
      [provider.name, stop],
    );

    const clearApiErrorAlert = useCallback(() => {
      setLlmErrorAlert(undefined);
    }, []);

    useEffect(() => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.style.height = 'auto';

        const scrollHeight = textarea.scrollHeight;

        textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
        textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
      }
    }, [input, textareaRef]);

    const runAnimation = async () => {
      if (chatStarted) {
        return;
      }

      try {
        // Check if elements exist before animating
        const examplesEl = document.querySelector('#examples');
        const introEl = document.querySelector('#intro');

        const animations = [];

        if (examplesEl) {
          animations.push(animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }));
        }

        if (introEl) {
          animations.push(animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }));
        }

        if (animations.length > 0) {
          await Promise.all(animations);
        }
      } catch (error) {
        console.warn('Animation error (non-critical):', error);
      }

      chatStore.setKey('started', true);
      setChatStarted(true);
    };

    // Helper function to create message parts array from text and images
    const createMessageParts = (text: string, images: string[] = []): Array<TextUIPart | FileUIPart> => {
      // Create an array of properly typed message parts
      const parts: Array<TextUIPart | FileUIPart> = [
        {
          type: 'text',
          text,
        },
      ];

      // Add image parts if any
      images.forEach((imageData) => {
        // Extract correct MIME type from the data URL
        const mimeType = imageData.split(';')[0].split(':')[1] || 'image/jpeg';

        // Create file part according to AI SDK format
        parts.push({
          type: 'file',
          mimeType,
          data: imageData.replace(/^data:image\/[^;]+;base64,/, ''),
        });
      });

      return parts;
    };

    // Helper function to convert File[] to Attachment[] for AI SDK
    const filesToAttachments = async (files: File[]): Promise<Attachment[] | undefined> => {
      if (files.length === 0) {
        return undefined;
      }

      const attachments = await Promise.all(
        files.map(
          (file) =>
            new Promise<Attachment>((resolve) => {
              const reader = new FileReader();

              reader.onloadend = () => {
                resolve({
                  name: file.name,
                  contentType: file.type,
                  url: reader.result as string,
                });
              };
              reader.readAsDataURL(file);
            }),
        ),
      );

      return attachments;
    };

    const sendMessage = async (_event: React.UIEvent, messageInput?: string): Promise<boolean> => {
      const messageContent = messageInput || input;
      const originalInput = messageContent;

      if (!messageContent?.trim()) {
        return false;
      }

      if (isLoading) {
        abort();
        return false;
      }

      try {
        let finalMessageContent = messageContent;
        let displayMessageContent = messageContent; // What user sees in chat
        let summary: GenerationSummary | null = null;
        const isDesignPrompt = shouldEnhancePrompt(messageContent);

        // Enhance prompt with design system if it's a design/website request.
        if (isDesignPrompt) {
          try {
            // Inject Layout Mutation to guarantee uniqueness
            const baseSeed = createLayoutSeed(messageContent);
            const variation = Math.random() * 1000;
            const layoutStrategy = generateLayoutStrategy(baseSeed + variation);
            const layoutInstructions = getLayoutInstructions(layoutStrategy);

            // Append instructions invisibly to the enhancer
            const mutatedContent = `${messageContent}\n\n${layoutInstructions}`;

            const enhanced = await enhancePromptWithDesignSystem(mutatedContent);
            finalMessageContent = enhanced.enhancedPrompt;
            displayMessageContent = enhanced.displayPrompt ?? messageContent;
            summary = buildGenerationSummary(messageContent, enhanced);

            if (enhanced.sectionContract?.order?.length) {
              workbenchStore.setPendingSectionContract(enhanced.sectionContract);
            } else {
              workbenchStore.clearPendingSectionContract();
            }

            console.log('=== PROMPT ENHANCER DEBUG ===');
            console.log('Theme:', enhanced.detectedTheme);
            console.log('Images:', JSON.stringify(enhanced.images, null, 2));
            console.log('Image prompt:', enhanced.imagePrompt);
            console.log('Enhanced prompt (first 800 chars):', enhanced.enhancedPrompt?.substring(0, 800));
            console.log('=============================');
          } catch (enhanceError: any) {
            logger.error('prompt enhancer failed', enhanceError);
            workbenchStore.clearPendingSectionContract();
            finalMessageContent = messageContent;
            displayMessageContent = messageContent;
            summary = buildGenerationSummary(messageContent);

            const errorMessage =
              typeof enhanceError?.message === 'string' && enhanceError.message.trim().length > 0
                ? enhanceError.message.trim()
                : 'Unknown error';
            const shortMessage = errorMessage.length > 140 ? `${errorMessage.slice(0, 137)}...` : errorMessage;
            toast.error(`Prompt enhancer failed (${shortMessage}). Using the original prompt.`);
          }
        } else {
          workbenchStore.clearPendingSectionContract();
          summary = buildGenerationSummary(messageContent);
        }

        setGenerationSummary(summary);

        if (selectedElement) {
          console.log('Selected Element:', selectedElement);

          const elementInfo = `<div class=\"__boltSelectedElement__\" data-element='${JSON.stringify(selectedElement)}'>${JSON.stringify(`${selectedElement.displayText}`)}</div>`;
          finalMessageContent = `${finalMessageContent}\n\n${elementInfo}`;
        }

        runAnimation();

        if (!chatStarted) {
          setFakeLoading(true);

          if (autoSelectTemplate && !isDesignPrompt) {
            const { template, title } = await selectStarterTemplate({
              message: finalMessageContent,
              model,
              provider,
            });

            if (template !== 'blank') {
              const temResp = await getTemplates(template, title).catch((e) => {
                if (e.message.includes('rate limit')) {
                  toast.warning('Rate limit exceeded. Skipping starter template\n Continuing with blank template');
                } else {
                  toast.warning('Failed to import starter template\n Continuing with blank template');
                }

                return null;
              });

              if (temResp) {
                const { assistantMessage, userMessage } = temResp;
                const userMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${displayMessageContent}`;
                const llmMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${finalMessageContent}`;

                setMessages([
                  {
                    id: `1-${new Date().getTime()}`,
                    role: 'user',
                    content: userMessageText,
                    parts: createMessageParts(userMessageText, imageDataList),
                    annotations: [{ type: 'llmPrompt', value: llmMessageText }],
                  },
                  {
                    id: `2-${new Date().getTime()}`,
                    role: 'assistant',
                    content: assistantMessage,
                  },
                  {
                    id: `3-${new Date().getTime()}`,
                    role: 'user',
                    content: `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${userMessage}`,
                    annotations: ['hidden'],
                  },
                ]);

                const reloadOptions =
                  uploadedFiles.length > 0
                    ? { experimental_attachments: await filesToAttachments(uploadedFiles) }
                    : undefined;

                reload(reloadOptions);
                setInput('');
                Cookies.remove(PROMPT_COOKIE_KEY);

                setUploadedFiles([]);
                setImageDataList([]);

                resetEnhancer();

                textareaRef.current?.blur();
                setFakeLoading(false);

                return true;
              }
            }
          }
        }

        // If autoSelectTemplate is disabled or template selection failed, proceed with normal message
        const userMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${displayMessageContent}`;
        const llmMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${finalMessageContent}`;
        const attachments = uploadedFiles.length > 0 ? await filesToAttachments(uploadedFiles) : undefined;

        setMessages([
          {
            id: `${new Date().getTime()}`,
            role: 'user',
            content: userMessageText,
            parts: createMessageParts(userMessageText, imageDataList),
            experimental_attachments: attachments,
            annotations: [{ type: 'llmPrompt', value: llmMessageText }],
          },
        ]);
        reload(attachments ? { experimental_attachments: attachments } : undefined);
        setFakeLoading(false);
        setInput('');
        Cookies.remove(PROMPT_COOKIE_KEY);

        setUploadedFiles([]);
        setImageDataList([]);

        resetEnhancer();

        textareaRef.current?.blur();

        const modifiedFiles = workbenchStore.getModifiedFiles();

        chatStore.setKey('aborted', false);

        if (modifiedFiles !== undefined) {
          const userUpdateArtifact = filesToArtifacts(modifiedFiles, `${Date.now()}`);
          const messageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${displayMessageContent}`;
          const llmMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${userUpdateArtifact}${finalMessageContent}`;

          const attachmentOptions =
            uploadedFiles.length > 0
              ? { experimental_attachments: await filesToAttachments(uploadedFiles) }
              : undefined;

          append(
            {
              role: 'user',
              content: messageText,
              parts: createMessageParts(messageText, imageDataList),
              annotations: [{ type: 'llmPrompt', value: llmMessageText }],
            },
            attachmentOptions,
          );

          workbenchStore.resetAllFileModifications();
        } else {
          const messageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${displayMessageContent}`;
          const llmMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${finalMessageContent}`;

          const attachmentOptions =
            uploadedFiles.length > 0
              ? { experimental_attachments: await filesToAttachments(uploadedFiles) }
              : undefined;

          append(
            {
              role: 'user',
              content: messageText,
              parts: createMessageParts(messageText, imageDataList),
              annotations: [{ type: 'llmPrompt', value: llmMessageText }],
            },
            attachmentOptions,
          );
        }

        setInput('');
        Cookies.remove(PROMPT_COOKIE_KEY);

        setUploadedFiles([]);
        setImageDataList([]);

        resetEnhancer();

        textareaRef.current?.blur();

        return true;
      } catch (sendError: any) {
        logger.error('sendMessage failed', sendError);
        setFakeLoading(false);
        setInput(originalInput);

        const rawMessage = sendError?.message || 'Failed to send message.';
        const safeMessage = String(rawMessage)
          .replace(/[^\x20-\x7E]+/g, ' ')
          .trim();
        toast.error(safeMessage || 'Failed to send message.');

        return false;
      }
    };

    useEffect(() => {
      const autoFix = actionAlert?.autoFix;

      if (!autoFix || !autoFixValidationEnabled || isLoading || fakeLoading) {
        return;
      }

      if (autoFixKeysRef.current.has(autoFix.key)) {
        return;
      }

      autoFixKeysRef.current.add(autoFix.key);
      sendMessage({} as React.UIEvent, autoFix.message);
    }, [actionAlert, isLoading, fakeLoading, sendMessage]);

    /**
     * Handles the change event for the textarea and updates the input state.
     * @param event - The change event from the textarea.
     */
    const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(event);
    };

    /**
     * Debounced function to cache the prompt in cookies.
     * Caches the trimmed value of the textarea input after a delay to optimize performance.
     */
    const debouncedCachePrompt = useCallback(
      debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = event.target.value.trim();
        Cookies.set(PROMPT_COOKIE_KEY, trimmedValue, { expires: 30 });
      }, 1000),
      [],
    );

    useEffect(() => {
      const storedApiKeys = Cookies.get('apiKeys');

      if (storedApiKeys) {
        setApiKeys(JSON.parse(storedApiKeys));
      }
    }, []);

    const handleModelChange = (newModel: string) => {
      setModel(newModel);
      Cookies.set('selectedModel', newModel, { expires: 30 });
    };

    const handleProviderChange = (newProvider: ProviderInfo) => {
      setProvider(newProvider);
      Cookies.set('selectedProvider', newProvider.name, { expires: 30 });
    };

    return (
      <BaseChat
        ref={animationScope}
        textareaRef={textareaRef}
        input={input}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isStreaming}
        onStreamingChange={(streaming) => {
          streamingState.set(streaming);
        }}
        generationSummary={generationSummary}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        sendMessage={sendMessage}
        model={model}
        setModel={handleModelChange}
        provider={provider}
        setProvider={handleProviderChange}
        providerList={activeProviders}
        handleInputChange={(e) => {
          const decodedValue = decodePromptValue(e.target.value);

          if (decodedValue !== e.target.value) {
            setInput(decodedValue);
            debouncedCachePrompt({ target: { value: decodedValue } } as React.ChangeEvent<HTMLTextAreaElement>);

            return;
          }

          onTextareaChange(e);
          debouncedCachePrompt(e);
        }}
        handleStop={abort}
        description={description}
        importChat={importChat}
        exportChat={exportChat}
        messages={renderMessages}
        enhancePrompt={() => {
          enhancePrompt(
            input,
            (input) => {
              setInput(input);
              scrollTextArea();
            },
            model,
            provider,
            apiKeys,
          );
        }}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        imageDataList={imageDataList}
        setImageDataList={setImageDataList}
        actionAlert={actionAlert}
        clearAlert={() => workbenchStore.clearAlert()}
        supabaseAlert={supabaseAlert}
        clearSupabaseAlert={() => workbenchStore.clearSupabaseAlert()}
        deployAlert={deployAlert}
        clearDeployAlert={() => workbenchStore.clearDeployAlert()}
        llmErrorAlert={llmErrorAlert}
        clearLlmErrorAlert={clearApiErrorAlert}
        data={renderData}
        chatMode={chatMode}
        setChatMode={setChatMode}
        append={append}
        designScheme={designScheme}
        setDesignScheme={setDesignScheme}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
        addToolResult={addToolResult}
      />
    );
  },
);
