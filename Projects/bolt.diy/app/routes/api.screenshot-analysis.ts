import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { z } from 'zod';
import { generateObject, type ImagePart, type TextPart } from 'ai';
import type { ProviderInfo } from '~/types/model';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, PROVIDER_LIST } from '~/utils/constants';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { createScopedLogger } from '~/utils/logger';

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

  try {
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

    const modelInstance = providerInfo.getModelInstance({
      model,
      serverEnv: context.cloudflare?.env as any,
      apiKeys,
      providerSettings,
    });

    const result = await generateObject<ScreenshotAnalysis>({
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

    return new Response(JSON.stringify({ analysis: result.object }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Screenshot analysis failed';
    logger.error('Screenshot analysis failed', { message });

    const status =
      typeof message === 'string' && message.toLowerCase().includes('api key') ? 401 : 503;

    return new Response(JSON.stringify({ error: true, message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
