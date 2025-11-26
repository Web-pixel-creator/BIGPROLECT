import { useState, useRef, useEffect } from 'react';
import { classNames } from '~/utils/classNames';

interface ModelOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  provider: 'gemini' | 'deepseek' | 'openrouter';
}

interface CustomModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Best All-Around',
    icon: 'i-ph:sparkle',
    provider: 'gemini',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Best for UI - Fast',
    icon: 'i-ph:lightning',
    provider: 'gemini',
  },
  {
    id: 'deepseek/deepseek-chat-v3.1',
    name: 'DeepSeek V3.1',
    description: 'Best for Coding',
    icon: 'i-ph:code',
    provider: 'openrouter',
  },
  {
    id: 'x-ai/grok-4.1-fast:free',
    name: 'Grok 4.1 Fast',
    description: 'Fast & Free',
    icon: 'i-ph:rocket',
    provider: 'openrouter',
  },
];

export function CustomModelSelector({ selectedModel, onModelChange }: CustomModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelData = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Model Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'flex items-center gap-2 px-4 py-2.5 rounded-lg',
          'bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor',
          'text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3',
          'transition-all duration-200',
          'min-w-[200px]',
        )}
      >
        <div className={classNames(selectedModelData.icon, 'text-lg')} />
        <div className="flex-1 text-left">
          <div className="font-medium text-sm">{selectedModelData.name}</div>
        </div>
        <div className={classNames('i-ph:caret-down text-sm transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={classNames(
            'absolute bottom-full left-0 mb-2 w-[320px]',
            'bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor',
            'rounded-lg shadow-xl overflow-hidden',
            'animate-fade-in',
          )}
        >
          <div className="p-2 space-y-1">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={classNames(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'text-left transition-all duration-200',
                  selectedModel === model.id
                    ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                    : 'hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary',
                )}
              >
                <div className={classNames(model.icon, 'text-xl flex-shrink-0')} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs opacity-70">{model.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Show More Button */}
          <button
            className={classNames(
              'w-full flex items-center justify-center gap-2 px-3 py-2.5',
              'border-t border-bolt-elements-borderColor',
              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
              'hover:bg-bolt-elements-background-depth-3',
              'transition-all duration-200 text-sm',
            )}
            onClick={() => {
              // TODO: Open full model selector
              setIsOpen(false);
            }}
          >
            <div className="i-ph:caret-down text-sm" />
            <span>Show more</span>
          </button>
        </div>
      )}
    </div>
  );
}
