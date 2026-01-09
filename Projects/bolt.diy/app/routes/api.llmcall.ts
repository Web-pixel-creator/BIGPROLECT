import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText } from '~/lib/.server/llm/stream-text';
import type { IProviderSetting, ProviderInfo } from '~/types/model';
import { generateText } from 'ai';
import { PROVIDER_LIST } from '~/utils/constants';
import { MAX_TOKENS, PROVIDER_COMPLETION_LIMITS, isReasoningModel } from '~/lib/.server/llm/constants';
import { LLMManager } from '~/lib/modules/llm/manager';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { createScopedLogger } from '~/utils/logger';

export async function action(args: ActionFunctionArgs) {
  return llmCallAction(args);
}

async function getModelList(options: {
  apiKeys?: Record<string, string>;
  providerSettings?: Record<string, IProviderSetting>;
  serverEnv?: Record<string, string>;
}) {
  const llmManager = LLMManager.getInstance(import.meta.env);
  return llmManager.updateModelList(options);
}

const logger = createScopedLogger('api.llmcall');

function getCompletionTokenLimit(modelDetails: ModelInfo): number {
  // 1. If model specifies completion tokens, use that
  if (modelDetails.maxCompletionTokens && modelDetails.maxCompletionTokens > 0) {
    return modelDetails.maxCompletionTokens;
  }

  // 2. Use provider-specific default
  const providerDefault = PROVIDER_COMPLETION_LIMITS[modelDetails.provider];

  if (providerDefault) {
    return providerDefault;
  }

  // 3. Final fallback to MAX_TOKENS, but cap at reasonable limit for safety
  return Math.min(MAX_TOKENS, 16384);
}

function validateTokenLimits(modelDetails: ModelInfo): { valid: boolean; error?: string } {
  // Just check that model has valid configuration
  const modelMaxTokens = modelDetails.maxTokenAllowed || 128000;
  const maxCompletionTokens = getCompletionTokenLimit(modelDetails);

  if (modelMaxTokens <= 0 || maxCompletionTokens <= 0) {
    return {
      valid: false,
      error: `Invalid token configuration for model ${modelDetails.name}`,
    };
  }

  return { valid: true };
}

async function llmCallAction({ context, request }: ActionFunctionArgs) {
  const { system, message, model, provider, streamOutput, purpose, stopSequences } = await request.json<{
    system: string;
    message: string;
    model: string;
    provider: ProviderInfo;
    streamOutput?: boolean;
    /** Purpose: 'template' (1024 tokens) or 'repair' (8192 tokens) */
    purpose?: 'template' | 'repair';
    /** Stop sequences for code repair sentinel pattern */
    stopSequences?: string[];
  }>();

  const { name: providerName } = provider;

  // validate 'model' and 'provider' fields
  if (!model || typeof model !== 'string') {
    throw new Response('Invalid or missing model', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  if (!providerName || typeof providerName !== 'string') {
    throw new Response('Invalid or missing provider', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  const cookieHeader = request.headers.get('Cookie');
  const apiKeys = getApiKeysFromCookie(cookieHeader);
  const providerSettings = getProviderSettingsFromCookie(cookieHeader);

  if (streamOutput) {
    try {
      const result = await streamText({
        options: {
          system,
        },
        messages: [
          {
            role: 'user',
            content: `${message}`,
          },
        ],
        env: context.cloudflare?.env as any,
        apiKeys,
        providerSettings,
      });

      return new Response(result.textStream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof Error && error.message?.includes('API key')) {
        throw new Response('Invalid or missing API key', {
          status: 401,
          statusText: 'Unauthorized',
        });
      }

      // Quota / rate limiting is often reported without the literal "429" or "rate limit" string.
      const errorMessage = error instanceof Error ? error.message || '' : '';
      const lowerErrorMessage = errorMessage.toLowerCase();
      const statusCode = (error as any)?.statusCode;

      if (
        statusCode === 429 ||
        lowerErrorMessage.includes('quota') ||
        lowerErrorMessage.includes('resource_exhausted') ||
        lowerErrorMessage.includes('too many requests') ||
        lowerErrorMessage.includes('requests per minute') ||
        lowerErrorMessage.includes('tokens per minute')
      ) {
        throw new Response(
          'API quota/rate limit exceeded. Please wait and try again, or check provider billing/quotas.',
          {
            status: 429,
            statusText: 'Rate Limit Exceeded',
          },
        );
      }

      // Handle token limit errors with helpful messages
      if (
        error instanceof Error &&
        (error.message?.includes('max_tokens') ||
          (error.message?.includes('token') && error.message?.includes('limit')) ||
          error.message?.includes('exceeds') ||
          error.message?.includes('maximum'))
      ) {
        throw new Response(
          `Token limit error: ${error.message}. Try reducing your request size or using a model with higher token limits.`,
          {
            status: 400,
            statusText: 'Token Limit Exceeded',
          },
        );
      }

      throw new Response(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }
  } else {
    try {
      const models = await getModelList({ apiKeys, providerSettings, serverEnv: context.cloudflare?.env as any });
      const modelDetails = models.find((m: ModelInfo) => m.name === model);

      if (!modelDetails) {
        throw new Error('Model not found');
      }

      /*
       * NOTE: `/api/llmcall` is currently only used for starter template selection.
       * Keep the output token budget intentionally small to avoid provider-specific max output limits
       * (e.g. Gemini output caps) and to reduce the chance of quota/limit errors.
       */
      const dynamicMaxTokens = modelDetails ? getCompletionTokenLimit(modelDetails) : Math.min(MAX_TOKENS, 16384);

      // Validate token limits before making API request
      const validation = validateTokenLimits(modelDetails);

      if (!validation.valid) {
        throw new Response(validation.error, {
          status: 400,
          statusText: 'Token Limit Exceeded',
        });
      }

      const providerInfo = PROVIDER_LIST.find((p) => p.name === provider.name);

      if (!providerInfo) {
        throw new Error('Provider not found');
      }

      logger.info(`Generating response Provider: ${provider.name}, Model: ${modelDetails.name}`);

      // DEBUG: Log reasoning model detection
      const isReasoning = isReasoningModel(modelDetails.name);
      logger.info(`DEBUG: Model "${modelDetails.name}" detected as reasoning model: ${isReasoning}`);

      // Token limits depend on purpose:
      // - 'template': small output for template selection XML (1024)
      // - 'repair': larger output for code repair (8192)
      const TEMPLATE_SELECTION_MAX_TOKENS = 1024;
      const REPAIR_MAX_TOKENS = 8192;

      let safeMaxTokens: number;

      if (purpose === 'repair') {
        safeMaxTokens = Math.max(1, Math.min(dynamicMaxTokens, REPAIR_MAX_TOKENS));
        logger.info(`Using repair token cap: ${safeMaxTokens}`);
      } else {
        safeMaxTokens = Math.max(1, Math.min(dynamicMaxTokens, TEMPLATE_SELECTION_MAX_TOKENS));
      }

      // Use maxCompletionTokens for reasoning models (o1, GPT-5), maxTokens for traditional models
      const tokenParams = isReasoning ? { maxCompletionTokens: safeMaxTokens } : { maxTokens: safeMaxTokens };

      // Filter out unsupported parameters for reasoning models
      const baseParams = {
        system,
        messages: [
          {
            role: 'user' as const,
            content: `${message}`,
          },
        ],
        model: providerInfo.getModelInstance({
          model: modelDetails.name,
          serverEnv: context.cloudflare?.env as any,
          apiKeys,
          providerSettings,
        }),
        ...tokenParams,
        toolChoice: 'none' as const,
      };

      // For reasoning models, set temperature to 1 (required by OpenAI API)
      // Add stopSequences if provided (for code repair sentinel pattern)
      const stopParams =
        stopSequences && stopSequences.length > 0 && !isReasoning ? { stopSequences } : {};

      const finalParams = isReasoning
        ? { ...baseParams, temperature: 1 } // Set to 1 for reasoning models (only supported value)
        : { ...baseParams, temperature: 0, ...stopParams };

      // DEBUG: Log final parameters
      logger.info(
        `DEBUG: Final params for model "${modelDetails.name}":`,
        JSON.stringify(
          {
            isReasoning,
            hasTemperature: 'temperature' in finalParams,
            hasMaxTokens: 'maxTokens' in finalParams,
            hasMaxCompletionTokens: 'maxCompletionTokens' in finalParams,
            paramKeys: Object.keys(finalParams).filter((key) => !['model', 'messages', 'system'].includes(key)),
            tokenParams,
            finalParams: Object.fromEntries(
              Object.entries(finalParams).filter(([key]) => !['model', 'messages', 'system'].includes(key)),
            ),
          },
          null,
          2,
        ),
      );

      const result = await generateText(finalParams);
      logger.info(`Generated response`);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: unknown) {
      console.log(error);

      const errorResponse = {
        error: true,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        statusCode: (error as any).statusCode || 500,
        isRetryable: (error as any).isRetryable !== false,
        provider: (error as any).provider || 'unknown',
      };

      if (
        (error instanceof Error &&
          (error.message?.toLowerCase().includes('api key') ||
            error.message?.toLowerCase().includes('unauthorized') ||
            error.message?.toLowerCase().includes('authentication'))) ||
        errorResponse.message?.toLowerCase().includes('api key') ||
        errorResponse.message?.toLowerCase().includes('unauthorized') ||
        errorResponse.message?.toLowerCase().includes('authentication')
      ) {
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

      const lowerErrorMessage =
        typeof errorResponse.message === 'string'
          ? errorResponse.message.toLowerCase()
          : String(errorResponse.message).toLowerCase();

      // Quota / rate limiting should not be treated as token/context window issues.
      if (
        errorResponse.statusCode === 429 ||
        lowerErrorMessage.includes('quota') ||
        lowerErrorMessage.includes('resource_exhausted') ||
        lowerErrorMessage.includes('too many requests') ||
        lowerErrorMessage.includes('requests per minute') ||
        lowerErrorMessage.includes('tokens per minute')
      ) {
        return new Response(
          JSON.stringify({
            ...errorResponse,
            message:
              'API quota/rate limit exceeded. Please wait a moment and try again, or check billing/quotas for the selected provider/model.',
            statusCode: 429,
            isRetryable: true,
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
            statusText: 'Rate Limit Exceeded',
          },
        );
      }

      // Handle token limit errors with helpful messages
      if (
        error instanceof Error &&
        (error.message?.includes('max_tokens') ||
          (error.message?.includes('token') && error.message?.includes('limit')) ||
          error.message?.includes('exceeds') ||
          error.message?.includes('maximum'))
      ) {
        return new Response(
          JSON.stringify({
            ...errorResponse,
            message: `Token limit error: ${error.message}. Try reducing your request size or using a model with higher token limits.`,
            statusCode: 400,
            isRetryable: false,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            statusText: 'Token Limit Exceeded',
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
}
