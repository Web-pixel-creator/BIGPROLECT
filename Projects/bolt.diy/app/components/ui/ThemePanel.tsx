import { useStore } from '@nanostores/react';
import React, { useState } from 'react';
import { themeVariablesStore, updateThemeVariable, resetThemeVariables } from '~/lib/stores/theme-store';

export function ThemePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const themeState = useStore(themeVariablesStore);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-bolt-elements-background-depth-2 shadow-lg border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3 transition-all"
        title="Customize Theme"
      >
        <div className="i-ph:paint-brush-broad text-xl text-bolt-elements-textPrimary" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-bolt-elements-background-depth-2 rounded-lg shadow-xl border border-bolt-elements-borderColor p-4 animate-in slide-in-from-bottom-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-bolt-elements-textPrimary">Visual Tuner</h3>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-bolt-elements-background-depth-3 rounded">
          <div className="i-ph:x text-bolt-elements-textSecondary" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-bolt-elements-textSecondary mb-1">Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={themeState.accentColor}
              onChange={(e) => updateThemeVariable('accentColor', e.target.value)}
              className="w-full h-8 cursor-pointer rounded border border-bolt-elements-borderColor"
            />
            <span className="text-xs text-bolt-elements-textSecondary font-mono self-center">
              {themeState.accentColor}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-bolt-elements-textSecondary mb-1">Primary Text</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={themeState.primaryColor}
              onChange={(e) => updateThemeVariable('primaryColor', e.target.value)}
              className="w-full h-8 cursor-pointer rounded border border-bolt-elements-borderColor"
            />
            <span className="text-xs text-bolt-elements-textSecondary font-mono self-center">
              {themeState.primaryColor}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-bolt-elements-borderColor">
          <button
            onClick={resetThemeVariables}
            className="w-full py-1 text-xs text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3 rounded transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
