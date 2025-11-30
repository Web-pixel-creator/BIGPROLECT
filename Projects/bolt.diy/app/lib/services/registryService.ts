import { createScopedLogger } from '~/utils/logger';

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

  async fetchRegistryIndex(registryName: string): Promise<RegistryComponent[]> {
    const baseUrl = this._config.registries[registryName];
    if (!baseUrl) {
      logger.warn(`Registry "${registryName}" not configured`);
      return [];
    }

    // Check cache
    const cached = this._cache.get(registryName);
    if (cached && Date.now() - cached.lastUpdated < CACHE_TTL) {
      return cached.components;
    }

    try {
      // Try to fetch registry index
      const indexUrl = `${baseUrl}/index.json`;
      logger.debug(`Fetching registry index from ${indexUrl}`);
      
      const response = await fetch(indexUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        // Try alternative endpoint
        const altUrl = `${baseUrl}/registry.json`;
        const altResponse = await fetch(altUrl);
        
        if (!altResponse.ok) {
          throw new Error(`Failed to fetch registry: ${response.status}`);
        }
        
        const data = await altResponse.json();
        return this._parseRegistryData(registryName, data);
      }

      const data = await response.json();
      const components = this._parseRegistryData(registryName, data);
      
      // Update cache
      this._cache.set(registryName, {
        components,
        lastUpdated: Date.now(),
      });

      return components;
    } catch (error) {
      logger.error(`Error fetching registry "${registryName}":`, error);
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
    const baseUrl = this._config.registries[registryName];
    if (!baseUrl) {
      logger.warn(`Registry "${registryName}" not configured`);
      return null;
    }

    try {
      const componentUrl = `${baseUrl}/${componentName}.json`;
      logger.debug(`Fetching component from ${componentUrl}`);

      const response = await fetch(componentUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });

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

  async getAllComponents(): Promise<RegistryComponent[]> {
    const allComponents: RegistryComponent[] = [];
    
    for (const registryName of Object.keys(this._config.registries)) {
      const components = await this.fetchRegistryIndex(registryName);
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
