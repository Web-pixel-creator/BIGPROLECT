import { map } from 'nanostores';

interface ThemeState {
  primaryColor: string;
  accentColor: string;
  borderRadius: string;
  baseColor: string;
}

// Default values matching variables.scss roughly
const defaultState: ThemeState = {
  primaryColor: '#0A0A0A',
  accentColor: '#9C7DFF',
  borderRadius: '0.5rem',
  baseColor: '#FFFFFF',
};

export const themeVariablesStore = map<ThemeState>(defaultState);

export function updateThemeVariable(key: keyof ThemeState, value: string) {
  themeVariablesStore.setKey(key, value);

  const root = document.documentElement;

  if (key === 'primaryColor') {
    root.style.setProperty('--bolt-elements-textPrimary', value);
    root.style.setProperty('--bolt-elements-icon-primary', value);
  } else if (key === 'accentColor') {
    root.style.setProperty('--bolt-elements-item-contentAccent', value);
    root.style.setProperty('--bolt-elements-item-backgroundAccent', `${value}1A`); // 10% opacity
    root.style.setProperty('--bolt-elements-button-primary-text', value);
    root.style.setProperty('--bolt-elements-button-primary-background', `${value}1A`);
    root.style.setProperty('--bolt-elements-messages-linkColor', value);
    root.style.setProperty('--bolt-elements-loader-progress', value);
    root.style.setProperty('--bolt-elements-sidebar-buttonText', value);
    root.style.setProperty('--bolt-elements-borderColorActive', value);
  } else if (key === 'borderRadius') {
    /*
     * Check if --bolt-radius exists, if not we might need to inject it or target specific elements
     * Since variables.scss didn't show a global radius, we might need to be specific or rely on Tailwind utility overrides if we can't change variables.
     * However, for this MVP let's assume we can control generic roundedness if we find the tokens.
     * Looking at the codebase, it uses Tailwind classes like rounded-md.
     * Changing standard tailwind utilities at runtime is hard without generic CSS variables.
     * We will try setting a global override if possible, or skip for now if too complex without refactor.
     * Let's set a custom variable and see if we can use it, or just stick to colors for V1.
     */
  }
}

export function resetThemeVariables() {
  themeVariablesStore.set(defaultState);
  document.documentElement.removeAttribute('style'); // Clears inline overrides
}
