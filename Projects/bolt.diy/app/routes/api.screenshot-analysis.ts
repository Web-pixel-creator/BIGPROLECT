import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { z } from 'zod';
import { generateObject, type ImagePart, type TextPart } from 'ai';
import type { ProviderInfo } from '~/types/model';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, PROVIDER_LIST } from '~/utils/constants';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { createScopedLogger } from '~/utils/logger';
import { LLMManager } from '~/lib/modules/llm/manager';

const logger = createScopedLogger('api.screenshot-analysis');

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 2_000_000;

const ScreenshotAnalysisSchema = z.object({
  layout: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  typography: z.string().default(''),
  components: z.array(z.string()).default([]),
  animations: z.string().default(''),
  style: z.string().default(''),
});

type ScreenshotAnalysis = z.infer<typeof ScreenshotAnalysisSchema>;

const SYSTEM_PROMPT = [
  'You are a design analyst.',
  'Analyze the provided screenshots and return a JSON object with the following fields:',
  '- layout: array of section types (hero, features, testimonials, pricing, faq, cta, footer, etc.)',
  '- colors: array of up to 5 HEX colors (e.g., #0F172A)',
  '- typography: short description of font pairing',
  '- components: list of component archetypes (e.g., hero-split, bento-grid, logo-wall)',
  '- animations: short description of motion style',
  '- style: short label (e.g., editorial, minimal, bold, futuristic)',
  'Return ONLY the JSON object. Keep arrays concise.',
].join('\n');

const FALLBACK_PROVIDER_ORDER = ['OpenAI', 'OpenRouter', 'Google', 'Anthropic', 'Together', 'Moonshot'];

const VISION_NAME_HINTS = [
  'vision',
  'gpt-4o',
  'gpt-4.1',
  'gpt-4-turbo',
  'gpt-4',
  'claude-3',
  'gemini',
  'pixtral',
  'llama-3.2-90b-vision',
  'qwen-vl',
  'phi-3-vision',
  'moonshot-v1',
];

const isLikelyVisionModel = (name: string): boolean => {
  const lower = name.toLowerCase();
  return VISION_NAME_HINTS.some((hint) => lower.includes(hint));
};

const isVisionSupportError = (message: string): boolean => {
  const lower = message.toLowerCase();

  if (
    lower.includes('api key') ||
    lower.includes('unauthorized') ||
    lower.includes('authentication') ||
    lower.includes('rate limit') ||
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('too many requests') ||
    lower.includes('tokens per minute') ||
    lower.includes('token limit')
  ) {
    return false;
  }

  if (lower.includes('image_url') || lower.includes('multimodal') || lower.includes('vision')) {
    return true;
  }

  return lower.includes('image') && (lower.includes('unsupported') || lower.includes('invalid') || lower.includes('type'));
};

const pickVisionModelFromList = (models: Array<{ name: string }>, currentModel?: string): string | undefined => {
  const filtered = models.filter((model) => model.name && model.name !== currentModel);
  const preferred = filtered.find((model) => isLikelyVisionModel(model.name));
  return preferred?.name ?? filtered[0]?.name;
};

const getProviderModels = async (options: {
  provider: ProviderInfo;
  apiKeys: Record<string, string>;
  providerSettings: Record<string, any>;
  serverEnv: Record<string, string>;
}): Promise<Array<{ name: string }>> => {
  const { provider, apiKeys, providerSettings, serverEnv } = options;

  const staticModels = Array.isArray((provider as any).staticModels) ? (provider as any).staticModels : [];
  if (staticModels.length > 0) {
    return staticModels;
  }

  try {
    const manager = LLMManager.getInstance(import.meta.env);
    const dynamicModels = await manager.getModelListFromProvider(provider, {
      apiKeys,
      providerSettings,
      serverEnv,
    });
    return dynamicModels ?? [];
  } catch (error) {
    logger.warn('Failed to fetch dynamic models for provider', { provider: provider.name, error });
    return [];
  }
};

const pickFallbackProvider = (apiKeys: Record<string, string>): ProviderInfo | undefined => {
  for (const name of FALLBACK_PROVIDER_ORDER) {
    if (apiKeys?.[name]) {
      const provider = PROVIDER_LIST.find((item) => item.name === name);
      if (provider) {
        return provider;
      }
    }
  }

  return undefined;
};

function parseDataUrl(input: string): { data: string; mimeType: string } | null {
  if (typeof input !== 'string') {
    return null;
  }

  const match = input.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const mimeType = match[1];
  const data = match[2];
  const estimatedBytes = Math.floor((data.length * 3) / 4);

  if (estimatedBytes > MAX_IMAGE_BYTES) {
    return null;
  }

  return { data, mimeType };
}

export async function action({ context, request }: ActionFunctionArgs) {
  let payload: { images?: string[]; model?: string; provider?: ProviderInfo };

  try {
    payload = (await request.json()) as { images?: string[]; model?: string; provider?: ProviderInfo };
  } catch {
    return new Response(JSON.stringify({ error: true, message: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rawImages = Array.isArray(payload.images) ? payload.images.slice(0, MAX_IMAGES) : [];
  const parsedImages = rawImages
    .map(parseDataUrl)
    .filter((image): image is { data: string; mimeType: string } => Boolean(image));

  if (parsedImages.length === 0) {
    return new Response(JSON.stringify({ error: true, message: 'No valid images provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const providerName = payload.provider?.name ?? DEFAULT_PROVIDER.name;
  const providerInfo = PROVIDER_LIST.find((p) => p.name === providerName) ?? DEFAULT_PROVIDER;
  const model = payload.model ?? DEFAULT_MODEL;

  const cookieHeader = request.headers.get('Cookie');
  const apiKeys = getApiKeysFromCookie(cookieHeader);
  const providerSettings = getProviderSettingsFromCookie(cookieHeader);

  const contentParts: Array<TextPart | ImagePart> = [
    {
      type: 'text',
      text: SYSTEM_PROMPT,
    },
    ...parsedImages.map((image) => ({
      type: 'image',
      image: image.data,
      mimeType: image.mimeType,
    })),
  ];

  const runAnalysis = async (targetProvider: ProviderInfo, targetModel: string) => {
    const modelInstance = targetProvider.getModelInstance({
      model: targetModel,
      serverEnv: context.cloudflare?.env as any,
      apiKeys,
      providerSettings,
    });

    return generateObject<ScreenshotAnalysis>({
      model: modelInstance,
      schema: ScreenshotAnalysisSchema,
      schemaName: 'ScreenshotAnalysis',
      mode: 'json',
      temperature: 0.2,
      maxTokens: 512,
      messages: [
        {
          role: 'user',
          content: contentParts,
        },
      ],
    });
  };

  try {
    const result = await runAnalysis(providerInfo, model);

    return new Response(JSON.stringify({ analysis: result.object }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Screenshot analysis failed';
    logger.warn('Screenshot analysis failed', { message });

    if (isVisionSupportError(message)) {
      const availableModels = await getProviderModels({
        provider: providerInfo,
        apiKeys,
        providerSettings,
        serverEnv: context.cloudflare?.env as any,
      });
      const fallbackModel = pickVisionModelFromList(availableModels, model);

      if (fallbackModel) {
        try {
          const result = await runAnalysis(providerInfo, fallbackModel);

          return new Response(JSON.stringify({ analysis: result.object, fallbackModel }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (fallbackError: unknown) {
          const fallbackMessage =
            fallbackError instanceof Error ? fallbackError.message : 'Fallback analysis failed';
          logger.warn('Screenshot analysis fallback failed', { fallbackMessage });
        }
      }

      const fallbackProvider = pickFallbackProvider(apiKeys);
      if (fallbackProvider && fallbackProvider.name !== providerInfo.name) {
        const fallbackModels = await getProviderModels({
          provider: fallbackProvider,
          apiKeys,
          providerSettings,
          serverEnv: context.cloudflare?.env as any,
        });
        const fallbackModelFromProvider = pickVisionModelFromList(fallbackModels);

        if (fallbackModelFromProvider) {
          try {
            const result = await runAnalysis(fallbackProvider, fallbackModelFromProvider);

            return new Response(
              JSON.stringify({
                analysis: result.object,
                fallbackModel: fallbackModelFromProvider,
                fallbackProvider: fallbackProvider.name,
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              },
            );
          } catch (fallbackError: unknown) {
            const fallbackMessage =
              fallbackError instanceof Error ? fallbackError.message : 'Fallback analysis failed';
            logger.warn('Screenshot analysis fallback provider failed', { fallbackMessage });
          }
        }
      }
    }

    const status =
      typeof message === 'string' && message.toLowerCase().includes('api key') ? 401 : 503;

    return new Response(JSON.stringify({ error: true, message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
