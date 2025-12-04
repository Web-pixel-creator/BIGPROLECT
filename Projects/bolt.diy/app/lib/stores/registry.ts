import { create } from 'zustand';

const REGISTRY_SETTINGS_KEY = 'registry_settings';
const isBrowser = typeof window !== 'undefined';

export interface RegistryComponent {
  name: string;
  type: string;
  description?: string;
  registry: string;
  dependencies?: string[];
}

export interface RegistrySettings {
  registries: Record<string, string>;
  enabledRegistries: string[];
}

const defaultSettings: RegistrySettings = {
  registries: {
    '@aceternity': 'https://ui.aceternity.com/registry',
    '@cult-ui': 'https://cult-ui.com/r',
    '@shadcn': 'https://ui.shadcn.com/registry',
  },
  enabledRegistries: ['@aceternity', '@cult-ui', '@shadcn'],
};

interface RegistryStore {
  isInitialized: boolean;
  isLoading: boolean;
  settings: RegistrySettings;
  components: RegistryComponent[];
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  updateSettings: (settings: Partial<RegistrySettings>) => void;
  fetchComponents: () => Promise<void>;
  addRegistry: (name: string, url: string) => void;
  removeRegistry: (name: string) => void;
  toggleRegistry: (name: string) => void;
  getComponentsForPrompt: () => string;
}

export const useRegistryStore = create<RegistryStore>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  settings: defaultSettings,
  components: [],
  error: null,

  initialize: async () => {
    if (get().isInitialized) return;

    if (isBrowser) {
      const saved = localStorage.getItem(REGISTRY_SETTINGS_KEY);
      if (saved) {
        try {
          const settings = JSON.parse(saved) as RegistrySettings;
          set({ settings });
        } catch (error) {
          console.error('Error parsing registry settings:', error);
        }
      }
    }

    set({ isInitialized: true });
    
    // Fetch components after initialization
    await get().fetchComponents();
  },

  updateSettings: (newSettings: Partial<RegistrySettings>) => {
    const currentSettings = get().settings;
    const updated = { ...currentSettings, ...newSettings };
    
    if (isBrowser) {
      localStorage.setItem(REGISTRY_SETTINGS_KEY, JSON.stringify(updated));
    }
    
    set({ settings: updated });
  },

  fetchComponents: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api.registry');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json() as { components?: RegistryComponent[] };
      set({ components: data.components || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching registry components:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  addRegistry: (name: string, url: string) => {
    const { settings } = get();
    const updated = {
      ...settings,
      registries: { ...settings.registries, [name]: url },
      enabledRegistries: [...settings.enabledRegistries, name],
    };
    
    if (isBrowser) {
      localStorage.setItem(REGISTRY_SETTINGS_KEY, JSON.stringify(updated));
    }
    
    set({ settings: updated });
  },

  removeRegistry: (name: string) => {
    const { settings } = get();
    const { [name]: _, ...remainingRegistries } = settings.registries;
    const updated = {
      ...settings,
      registries: remainingRegistries,
      enabledRegistries: settings.enabledRegistries.filter(r => r !== name),
    };
    
    if (isBrowser) {
      localStorage.setItem(REGISTRY_SETTINGS_KEY, JSON.stringify(updated));
    }
    
    set({ settings: updated });
  },

  toggleRegistry: (name: string) => {
    const { settings } = get();
    const isEnabled = settings.enabledRegistries.includes(name);
    const updated = {
      ...settings,
      enabledRegistries: isEnabled
        ? settings.enabledRegistries.filter(r => r !== name)
        : [...settings.enabledRegistries, name],
    };
    
    if (isBrowser) {
      localStorage.setItem(REGISTRY_SETTINGS_KEY, JSON.stringify(updated));
    }
    
    set({ settings: updated });
  },

  getComponentsForPrompt: () => {
    const { components, settings } = get();
    
    // Filter by enabled registries
    const enabledComponents = components.filter(c => 
      settings.enabledRegistries.includes(c.registry)
    );

    if (enabledComponents.length === 0) {
      return '';
    }

    // Group by registry
    const byRegistry: Record<string, RegistryComponent[]> = {};
    for (const comp of enabledComponents) {
      if (!byRegistry[comp.registry]) {
        byRegistry[comp.registry] = [];
      }
      byRegistry[comp.registry].push(comp);
    }

    let prompt = `
<available_ui_components_from_registries>
  These components are available from UI registries for design inspiration:
  
`;

    for (const [registry, comps] of Object.entries(byRegistry)) {
      prompt += `  ${registry}:\n`;
      for (const comp of comps.slice(0, 25)) {
        prompt += `    - ${comp.name}${comp.description ? ` - ${comp.description}` : ''}\n`;
      }
      prompt += '\n';
    }

    prompt += `
  NOTE: Use these as design inspiration. Implement using Tailwind CSS directly.
</available_ui_components_from_registries>`;

    return prompt;
  },
}));
