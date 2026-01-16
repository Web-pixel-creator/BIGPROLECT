/**
 * InputModeSelector - Toggle between Brief form and Chat modes
 */

import React from 'react';
import { classNames } from '~/utils/classNames';

export type InputMode = 'brief' | 'chat';

interface InputModeSelectorProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
  className?: string;
}

export function InputModeSelector({ mode, onChange, className }: InputModeSelectorProps) {
  return (
    <div className={classNames('flex items-center gap-1 p-1 rounded-lg bg-bolt-elements-background-depth-2', className)}>
      <button
        type="button"
        onClick={() => onChange('brief')}
        className={classNames(
          'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
          mode === 'brief'
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
            : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
        )}
      >
        <span className="i-ph:magic-wand" />
        Simple Mode
      </button>
      <button
        type="button"
        onClick={() => onChange('chat')}
        className={classNames(
          'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
          mode === 'chat'
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
            : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
        )}
      >
        <span className="i-ph:chat-circle-text" />
        Advanced Mode
      </button>
    </div>
  );
}
