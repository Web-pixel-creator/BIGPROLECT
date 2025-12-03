import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { registryService } from '~/lib/services/registryService';

// GET - fetch all components from registries
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const registry = url.searchParams.get('registry');
  const component = url.searchParams.get('component');
  const force = url.searchParams.get('refresh') === '1';
  const previewOnly = url.searchParams.get('preview') === '1';

  try {
    if (component && registry) {
      // Fetch specific component
      const comp = await registryService.fetchComponent(registry, component);
      return json(comp);
    } else if (registry) {
      // Fetch all components from specific registry
      const components = await registryService.fetchRegistryIndex(registry, force);
      return json({
        components: previewOnly ? components.slice(0, 10) : components,
        count: components.length,
        registry,
      });
    } else {
      // Fetch all components from all registries
      const components = await registryService.getAllComponents(force);
      const registries = registryService.getRegistries();
      const payload = previewOnly ? components.slice(0, 30) : components;
      return json({ components: payload, registries, count: components.length });
    }
  } catch (error) {
    console.error('Registry API error:', error);
    return json({ error: 'Failed to fetch registry data' }, { status: 500 });
  }
}

// POST - update registry configuration
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json() as { registries?: Record<string, string> };
    
    if (body.registries) {
      registryService.updateConfig({ registries: body.registries });
    }

    return json({ success: true, registries: registryService.getRegistries() });
  } catch (error) {
    console.error('Registry config update error:', error);
    return json({ error: 'Failed to update registry config' }, { status: 500 });
  }
}
