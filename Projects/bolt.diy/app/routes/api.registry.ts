import { json } from '@remix-run/cloudflare';
import type { LoaderFunction } from '@remix-run/cloudflare';
import effectsRegistry from '~/lib/constants/effects-registry.json';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview') === '1';
  const refresh = url.searchParams.get('refresh') === '1';

  /*
   * If refresh is requested, in a real dynamic system we would re-fetch or re-scan.
   * Here we just return the static data, but we could add logic if needed.
   */

  if (preview) {
    // Return a lightweight list for the UI
    const components = (effectsRegistry as any[]).map((effect) => ({
      name: effect.name,
      registry: effect.source,
      description: effect.hint,
    }));

    return json({
      count: effectsRegistry.length,
      components,
    });
  }

  return json(effectsRegistry);
};
