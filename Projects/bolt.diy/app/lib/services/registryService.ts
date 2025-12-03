import * as fs from 'fs';
import * as path from 'path';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('registry-service');

export interface RegistryComponent {
  name: string;
  type: string;
  description?: string;
  registry: string;
  dependencies?: string[];
  files?: Array<{
    path: string;
    content: string;
    type: string;
  }>;
}

export interface RegistryConfig {
  registries: Record<string, string>;
}

export interface ComponentsCache {
  components: RegistryComponent[];
  lastUpdated: number;
}

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const FETCH_TIMEOUT = 5000; // 5 seconds
const MAX_COMPONENTS_PER_REGISTRY = 50; // preview cap to avoid huge payloads

export class RegistryService {
  private static _instance: RegistryService;
  private _cache: Map<string, ComponentsCache> = new Map();
  private _config: RegistryConfig = {
    registries: {
      '@aceternity': 'https://ui.aceternity.com/registry',
      '@cult-ui': 'https://cult-ui.com/r',
      '@shadcn': 'https://ui.shadcn.com/registry',
    },
  };
  private _loadedFromFile = false;

  static getInstance(): RegistryService {
    if (!RegistryService._instance) {
      RegistryService._instance = new RegistryService();
    }
    return RegistryService._instance;
  }

  updateConfig(config: Partial<RegistryConfig>) {
    if (config.registries) {
      this._config.registries = { ...this._config.registries, ...config.registries };
    }
  }

  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    try {
      return await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(id);
    }
  }

  private loadRegistriesFromComponentsJson(): void {
    if (this._loadedFromFile) return;
    try {
      const componentsPath = path.resolve(process.cwd(), 'components.json');
      if (fs.existsSync(componentsPath)) {
        const content = fs.readFileSync(componentsPath, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed?.registries && typeof parsed.registries === 'object') {
          this._config.registries = {
            ...this._config.registries,
            ...parsed.registries,
          };
          logger.info('Registry config loaded from components.json');
        }
      }
    } catch (error) {
      logger.warn('Failed to load registries from components.json', error);
    } finally {
      this._loadedFromFile = true;
    }
  }

  async fetchRegistryIndex(registryName: string, force = false): Promise<RegistryComponent[]> {
    this.loadRegistriesFromComponentsJson();
    const baseUrl = this._config.registries[registryName];
    if (!baseUrl) {
      logger.warn(`Registry "${registryName}" not configured`);
      return [];
    }

    // Check cache
    const cached = this._cache.get(registryName);
    if (!force && cached && Date.now() - cached.lastUpdated < CACHE_TTL) {
      return cached.components;
    }

    try {
      let components: RegistryComponent[] | null = null;

      // Try to fetch registry index
      const indexUrl = `${baseUrl}/index.json`;
      logger.debug(`Fetching registry index from ${indexUrl}`);

      const response = await this.fetchWithTimeout(indexUrl);

      if (!response.ok) {
        // Try alternative endpoint
        const altUrl = `${baseUrl}/registry.json`;
        const altResponse = await this.fetchWithTimeout(altUrl);
        
        if (!altResponse.ok) {
          throw new Error(`Failed to fetch registry: ${response.status}`);
        }
        
        const data = await altResponse.json();
        components = this._parseRegistryData(registryName, data);
      } else {
        const data = await response.json();
        components = this._parseRegistryData(registryName, data);
      }
      
      // Cap to avoid huge payloads
      const limited = (components || []).slice(0, MAX_COMPONENTS_PER_REGISTRY);

      // Update cache even if empty to avoid spamming on failures
      this._cache.set(registryName, {
        components: limited,
        lastUpdated: Date.now(),
      });

      return limited;
    } catch (error) {
      logger.error(`Error fetching registry "${registryName}":`, error);
      // cache empty result to prevent repeated failures in short time
      this._cache.set(registryName, { components: [], lastUpdated: Date.now() });
      return [];
    }
  }

  private _parseRegistryData(registryName: string, data: any): RegistryComponent[] {
    const components: RegistryComponent[] = [];

    // Handle different registry formats
    if (Array.isArray(data)) {
      for (const item of data) {
        components.push({
          name: item.name,
          type: item.type || 'registry:ui',
          description: item.description || '',
          registry: registryName,
          dependencies: item.dependencies || [],
        });
      }
    } else if (data.items) {
      for (const item of data.items) {
        components.push({
          name: item.name,
          type: item.type || 'registry:ui',
          description: item.description || '',
          registry: registryName,
          dependencies: item.dependencies || [],
        });
      }
    } else if (typeof data === 'object') {
      // Handle object format where keys are component names
      for (const [name, details] of Object.entries(data)) {
        if (typeof details === 'object' && details !== null) {
          components.push({
            name,
            type: (details as any).type || 'registry:ui',
            description: (details as any).description || '',
            registry: registryName,
            dependencies: (details as any).dependencies || [],
          });
        }
      }
    }

    return components;
  }

  async fetchComponent(registryName: string, componentName: string): Promise<RegistryComponent | null> {
    this.loadRegistriesFromComponentsJson();
    const baseUrl = this._config.registries[registryName];
    if (!baseUrl) {
      logger.warn(`Registry "${registryName}" not configured`);
      return null;
    }

    try {
      const componentUrl = `${baseUrl}/${componentName}.json`;
      logger.debug(`Fetching component from ${componentUrl}`);

      const response = await this.fetchWithTimeout(componentUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch component: ${response.status}`);
      }

      const data = await response.json() as Record<string, any>;
      
      return {
        name: data.name || componentName,
        type: data.type || 'registry:ui',
        description: data.description || '',
        registry: registryName,
        dependencies: data.dependencies || [],
        files: data.files || [],
      };
    } catch (error) {
      logger.error(`Error fetching component "${componentName}" from "${registryName}":`, error);
      return null;
    }
  }

  async getAllComponents(force = false): Promise<RegistryComponent[]> {
    this.loadRegistriesFromComponentsJson();
    const allComponents: RegistryComponent[] = [];
    
    for (const registryName of Object.keys(this._config.registries)) {
      const components = await this.fetchRegistryIndex(registryName, force);
      allComponents.push(...components);
    }

    return allComponents;
  }

  getRegistries(): Record<string, string> {
    return { ...this._config.registries };
  }

  // Generate prompt section with available components
  async generateComponentsPromptSection(): Promise<string> {
    const components = await this.getAllComponents();
    
    if (components.length === 0) {
      return '';
    }

    // Group by registry
    const byRegistry: Record<string, RegistryComponent[]> = {};
    for (const comp of components) {
      if (!byRegistry[comp.registry]) {
        byRegistry[comp.registry] = [];
      }
      byRegistry[comp.registry].push(comp);
    }

    let prompt = `
<available_registry_components>
  The following UI components are available from external registries.
  You can reference these for design inspiration, but remember:
  - WebContainer cannot run npx/CLI commands
  - Use the component patterns and styles as inspiration
  - Implement similar functionality using plain Tailwind CSS
  
`;

    for (const [registry, comps] of Object.entries(byRegistry)) {
      prompt += `  ${registry.toUpperCase()} COMPONENTS:\n`;
      for (const comp of comps.slice(0, 30)) { // Limit to 30 per registry
        prompt += `  - ${comp.name}${comp.description ? `: ${comp.description}` : ''}\n`;
      }
      prompt += '\n';
    }

    prompt += `</available_registry_components>`;

    return prompt;
  }
}

// Singleton export
export const registryService = RegistryService.getInstance();
