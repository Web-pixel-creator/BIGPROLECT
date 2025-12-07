import React, { useEffect, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { ModelSelector } from '~/components/chat/ModelSelector';
import { APIKeyManager } from './APIKeyManager';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';
import FilePreview from './FilePreview';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { SendButton } from './SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import styles from './BaseChat.module.scss';
import type { ProviderInfo } from '~/types/model';
import { ColorSchemeDialog } from '~/components/ui/ColorSchemeDialog';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { McpTools } from './MCPTools';
import { CustomModelSelector } from './CustomModelSelector';
import { PROMPT_PRESETS, EFFECT_PRESETS, SECTION_PRESETS, THEME_PRESETS } from '~/lib/constants/promptPresets';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  uploadedFiles: File[];
  imageDataList: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  chatStarted: boolean;
  exportChat?: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  handleFileUpload: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const [registryStatus, setRegistryStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [registryCount, setRegistryCount] = useState<number | null>(null);
  const [registryPreview, setRegistryPreview] = useState<{ name: string; registry?: string; description?: string }[]>(
    [],
  );
  const promptPanelRef = useRef<HTMLDivElement | null>(null);
  const promptToggleRef = useRef<HTMLButtonElement | null>(null);
  const promptPresets = PROMPT_PRESETS;
  const effectsPresets = EFFECT_PRESETS;
  const sectionPresets = SECTION_PRESETS;
  const themePresets = THEME_PRESETS;
  const AUTO_REFRESH_REGISTRIES = false; // не обновляем реестры автоматически при открытии панели

  // Удаляем нечитаемые символы из превью реестров, чтобы не было "�"
  const normalizeText = (value?: string) =>
    typeof value === 'string' ? value.replace(/[^\p{L}\p{N}\s.,:;+\-"'()/&@#%!?]/gu, '').trim() : '';

  const setPrompt = (text: string) => {
    props.handleInputChange?.({
      target: { value: text },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
    setShowPromptPanel(false);
  };

  const appendSnippet = (text: string) => {
    const current = props.input || '';
    const next = current.trim().length ? `${current}\n${text}` : text;
    props.handleInputChange?.({
      target: { value: next },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
    setShowPromptPanel(false);
  };

  const refreshRegistries = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent;
    try {
      setRegistryStatus('loading');
      // Используем корректный путь API (слишком многие окружения блокируют точку в URL)
      const res = await fetch('/api/registry?refresh=1&preview=1');
      if (!res.ok) throw new Error('Failed to refresh registries');
      const data = await res.json();
      if (data?.count !== undefined) {
        setRegistryCount(data.count);
      }
      if (data?.components) {
        setRegistryPreview(data.components.slice(0, 10));
      }
      setRegistryStatus('ok');
      if (!silent) toast.success('Реестры обновлены');
    } catch (err) {
      setRegistryStatus('error');
      if (!silent) toast.error('Не удалось обновить реестры');
    } finally {
      setTimeout(() => setRegistryStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    if (!showPromptPanel) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        promptPanelRef.current &&
        !promptPanelRef.current.contains(target) &&
        promptToggleRef.current &&
        !promptToggleRef.current.contains(target)
      ) {
        setShowPromptPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPromptPanel]);

  useEffect(() => {
    if (!showPromptPanel || !AUTO_REFRESH_REGISTRIES) return;
    if (registryPreview.length === 0 && registryStatus !== 'loading') {
      refreshRegistries({ silent: true });
    }
  }, [showPromptPanel, registryPreview.length, registryStatus, AUTO_REFRESH_REGISTRIES]);

  return (
    <div
      className={classNames(
        'relative bg-bolt-elements-background-depth-2 backdrop-blur p-3 rounded-lg border border-bolt-elements-borderColor relative w-full max-w-[750px] mx-auto z-prompt',

        /*
         * {
         *   'sticky bottom-2': chatStarted,
         * },
         */
      )}
    >
      <svg className={classNames(styles.PromptEffectContainer)}>
        <defs>
          <linearGradient
            id="line-gradient"
            x1="20%"
            y1="0%"
            x2="-14%"
            y2="10%"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(-45)"
          >
            <stop offset="0%" stopColor="#b44aff" stopOpacity="0%"></stop>
            <stop offset="40%" stopColor="#b44aff" stopOpacity="80%"></stop>
            <stop offset="50%" stopColor="#b44aff" stopOpacity="80%"></stop>
            <stop offset="100%" stopColor="#b44aff" stopOpacity="0%"></stop>
          </linearGradient>
          <linearGradient id="shine-gradient">
            <stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
            <stop offset="40%" stopColor="#ffffff" stopOpacity="80%"></stop>
            <stop offset="50%" stopColor="#ffffff" stopOpacity="80%"></stop>
            <stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
          </linearGradient>
        </defs>
        <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
        <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
      </svg>
      {/* Temporarily hidden: Model selector and API key manager */}
      <div className="hidden">
        <ClientOnly>
          {() => (
            <div className={props.isModelSettingsCollapsed ? 'hidden' : ''}>
              <ModelSelector
                key={props.provider?.name + ':' + props.modelList.length}
                model={props.model}
                setModel={props.setModel}
                modelList={props.modelList}
                provider={props.provider}
                setProvider={props.setProvider}
                providerList={props.providerList || (PROVIDER_LIST as ProviderInfo[])}
                apiKeys={props.apiKeys}
                modelLoading={props.isModelLoading}
              />
              {(props.providerList || []).length > 0 &&
                props.provider &&
                !LOCAL_PROVIDERS.includes(props.provider.name) && (
                  <APIKeyManager
                    provider={props.provider}
                    apiKey={props.apiKeys[props.provider.name] || ''}
                    setApiKey={(key) => {
                      props.onApiKeysChange(props.provider.name, key);
                    }}
                  />
                )}
            </div>
          )}
        </ClientOnly>
      </div>
      <FilePreview
        files={props.uploadedFiles}
        imageDataList={props.imageDataList}
        onRemove={(index) => {
          props.setUploadedFiles?.(props.uploadedFiles.filter((_, i) => i !== index));
          props.setImageDataList?.(props.imageDataList.filter((_, i) => i !== index));
        }}
      />
      <ClientOnly>
        {() => (
          <ScreenshotStateManager
            setUploadedFiles={props.setUploadedFiles}
            setImageDataList={props.setImageDataList}
            uploadedFiles={props.uploadedFiles}
            imageDataList={props.imageDataList}
          />
        )}
      </ClientOnly>
      {props.selectedElement && (
        <div className="flex mx-1.5 gap-2 items-center justify-between rounded-lg rounded-b-none border border-b-none border-bolt-elements-borderColor text-bolt-elements-textPrimary flex py-1 px-2.5 font-medium text-xs">
          <div className="flex gap-2 items-center lowercase">
            <code className="bg-accent-500 rounded-4px px-1.5 py-1 mr-0.5 text-white">
              {props?.selectedElement?.tagName}
            </code>
            selected for inspection
          </div>
          <button
            className="bg-transparent text-accent-500 pointer-auto"
            onClick={() => props.setSelectedElement?.(null)}
          >
            Clear
          </button>
        </div>
      )}
      <div
        className={classNames('relative shadow-xs border border-bolt-elements-borderColor backdrop-blur rounded-lg')}
      >
        <textarea
          ref={props.textareaRef}
          className={classNames(
            'w-full pl-4 pt-4 pr-16 outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm',
            'transition-all duration-200',
            'hover:border-bolt-elements-focus',
          )}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '2px solid #1488fc';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '2px solid #1488fc';
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';

            const files = Array.from(e.dataTransfer.files);
            files.forEach((file) => {
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = (loadEvent) => {
                  const base64Image = loadEvent.target?.result as string;
                  props.setUploadedFiles?.([...props.uploadedFiles, file]);
                  props.setImageDataList?.([...props.imageDataList, base64Image]);
                };
                reader.readAsDataURL(file);
              }
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              }

              event.preventDefault();

              if (props.isStreaming) {
                props.handleStop?.();
                return;
              }

              // ignore if using input method engine
              if (event.nativeEvent.isComposing) {
                return;
              }

              props.handleSendMessage?.(event);
            }
          }}
          value={props.input}
          onChange={(event) => {
            props.handleInputChange?.(event);
          }}
          onPaste={props.handlePaste}
          style={{
            minHeight: props.TEXTAREA_MIN_HEIGHT,
            maxHeight: props.TEXTAREA_MAX_HEIGHT,
          }}
          placeholder={props.chatMode === 'build' ? 'How can Bolt help you today?' : 'What would you like to discuss?'}
          translate="no"
        />
        <ClientOnly>
          {() => (
            <SendButton
              show={props.input.length > 0 || props.isStreaming || props.uploadedFiles.length > 0}
              isStreaming={props.isStreaming}
              disabled={!props.providerList || props.providerList.length === 0}
              onClick={(event) => {
                if (props.isStreaming) {
                  props.handleStop?.();
                  return;
                }

                if (props.input.length > 0 || props.uploadedFiles.length > 0) {
                  props.handleSendMessage?.(event);
                }
              }}
            />
          )}
        </ClientOnly>
        <div className="flex justify-between items-center text-sm p-4 pt-2">
          <div className="flex gap-1 items-center">
            <ColorSchemeDialog designScheme={props.designScheme} setDesignScheme={props.setDesignScheme} />
            <McpTools />
            <IconButton title="Upload file" className="transition-all" onClick={() => props.handleFileUpload()}>
              <div className="i-ph:paperclip text-xl"></div>
            </IconButton>
            <IconButton
              title="Enhance prompt"
              disabled={props.input.length === 0 || props.enhancingPrompt}
              className={classNames('transition-all', props.enhancingPrompt ? 'opacity-100' : '')}
              onClick={() => {
                props.enhancePrompt?.();
                toast.success('Prompt enhanced!');
              }}
            >
              {props.enhancingPrompt ? (
                <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl animate-spin"></div>
              ) : (
                <div className="i-bolt:stars text-xl"></div>
              )}
            </IconButton>

            <SpeechRecognitionButton
              isListening={props.isListening}
              onStart={props.startListening}
              onStop={props.stopListening}
              disabled={props.isStreaming}
            />
            <div className="relative">
              <IconButton
                title="Быстрые промпты"
                className="transition-all"
                onClick={() => setShowPromptPanel((v) => !v)}
                ref={promptToggleRef}
              >
                <div className="i-ph:list text-xl"></div>
              </IconButton>
              <span
                className={classNames(
                  'absolute -top-1 -right-1 w-2 h-2 rounded-full',
                  registryStatus === 'loading'
                    ? 'bg-amber-500 animate-pulse'
                    : registryStatus === 'ok'
                      ? 'bg-emerald-500'
                      : registryStatus === 'error'
                        ? 'bg-rose-500'
                        : 'bg-bolt-elements-borderColor',
                )}
                title={
                  registryStatus === 'loading'
                    ? 'Обновляем реестры...'
                    : registryStatus === 'ok'
                      ? registryCount !== null
                        ? `Реестры готовы · ${registryCount}`
                        : 'Реестры готовы'
                      : registryStatus === 'error'
                        ? 'Ошибка реестров'
                        : 'Реестры'
                }
              ></span>
            </div>
            {props.chatStarted && (
              <IconButton
                title="Discuss"
                className={classNames(
                  'transition-all flex items-center gap-1 px-1.5',
                  props.chatMode === 'discuss'
                    ? '!bg-bolt-elements-item-backgroundAccent !text-bolt-elements-item-contentAccent'
                    : 'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault',
                )}
                onClick={() => {
                  props.setChatMode?.(props.chatMode === 'discuss' ? 'build' : 'discuss');
                }}
              >
                <div className={`i-ph:chats text-xl`} />
                {props.chatMode === 'discuss' ? <span>Discuss</span> : <span />}
              </IconButton>
            )}
            <CustomModelSelector
              selectedModel={props.model || 'gemini-2.5-pro'}
              onModelChange={(modelId) => {
                // Map model IDs to their correct providers
                let providerName = 'Google'; // default

                if (modelId.startsWith('gemini')) {
                  providerName = 'Google';
                } else if (modelId.includes('deepseek') || modelId.includes('grok')) {
                  providerName = 'OpenRouter';
                }

                // Find and set the provider
                const providerInfo = props.providerList.find((p) => p.name === providerName);

                if (providerInfo && props.setProvider) {
                  props.setProvider(providerInfo);
                }

                props.setModel?.(modelId);
              }}
            />
          </div>
          {props.input.length > 3 ? (
            <div className="text-xs text-bolt-elements-textTertiary">
              Use <kbd className="kdb px-1.5 py-0.5 rounded bg-bolt-elements-background-depth-2">Shift</kbd> +{' '}
              <kbd className="kdb px-1.5 py-0.5 rounded bg-bolt-elements-background-depth-2">Return</kbd> a new line
            </div>
          ) : null}
          <SupabaseConnection />
          <ExpoQrModal open={props.qrModalOpen} onClose={() => props.setQrModalOpen(false)} />
        </div>

{showPromptPanel && (
  <div
    ref={promptPanelRef}
    className="absolute top-2 right-2 z-30 w-80 max-h-96 overflow-auto rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 shadow-lg p-3 space-y-3"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-bolt-elements-textPrimary">Быстрые промпты</p>
        <p className="text-xs text-bolt-elements-textTertiary">Кликни, чтобы подставить в запрос</p>
      </div>
      <button
        className="text-xs text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
        onClick={() => setShowPromptPanel(false)}
      >
        Закрыть
      </button>
    </div>
    <div className="space-y-2">
      <p className="text-xs font-semibold text-bolt-elements-textSecondary uppercase">Промпты</p>
      <div className="flex flex-col gap-1">
        {promptPresets.map((p, idx) => (
          <button
            key={`prompt-${idx}`}
            className="text-left text-sm rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2 hover:border-bolt-elements-focus hover:text-bolt-elements-textPrimary transition-all"
            onClick={() => setPrompt(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xs font-semibold text-bolt-elements-textSecondary uppercase">Эффекты</p>
      <div className="flex flex-col gap-1">
        {effectsPresets.map((effect, idx) => (
          <button
            key={`effect-${idx}`}
            className="flex items-start gap-2 text-left text-sm rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2 hover:border-bolt-elements-focus hover:text-bolt-elements-textPrimary transition-all"
            onClick={() => appendSnippet(effect.label)}
            title={effect.hint}
          >
            <span
              className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-bolt-elements-background-depth-1 text-[10px] text-bolt-elements-textSecondary"
              title={effect.hint}
            >
              ?
            </span>
            <span className="flex flex-col gap-0.5">
              <span>{effect.label}</span>
              <span className="text-xs text-bolt-elements-textSecondary leading-snug">{effect.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
    <div className="flex items-center justify-between text-xs bg-bolt-elements-background-depth-2 rounded-md border border-bolt-elements-borderColor px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={classNames(
            'w-2 h-2 rounded-full',
            registryStatus === 'loading'
              ? 'bg-amber-500 animate-pulse'
              : registryStatus === 'ok'
                ? 'bg-emerald-500'
                : registryStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-bolt-elements-borderColor',
          )}
        ></span>
        <span className="text-bolt-elements-textSecondary">
          {registryStatus === 'loading'
            ? 'Обновляем реестры...'
            : registryStatus === 'ok'
              ? registryCount !== null
                ? `Реестры готовы · ${registryCount}`
                : 'Реестры готовы'
              : registryStatus === 'error'
                ? 'Ошибка реестров'
                : 'Реестры'}
        </span>
      </div>
      <button
        type="button"
        className="px-2 py-1 rounded-full border border-bolt-elements-borderColor hover:border-bolt-elements-focus hover:text-bolt-elements-textPrimary transition-all"
        onClick={refreshRegistries}
      >
        Обновить
      </button>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-semibold text-bolt-elements-textSecondary uppercase">Реестры (preview)</p>
      {registryPreview.length === 0 ? (
        <p className="text-xs text-bolt-elements-textTertiary">Пока пусто (обновите)</p>
      ) : (
        <ul className="space-y-1">
          {registryPreview.slice(0, 5).map((item, idx) => (
            <li
              key={`reg-${idx}`}
              className="text-xs rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-2 py-1"
            >
              <span className="font-medium text-bolt-elements-textPrimary">{normalizeText(item.name)}</span>
              {item.registry ? (
                <span className="ml-1 text-bolt-elements-textTertiary">({normalizeText(item.registry)})</span>
              ) : null}
              {item.description ? (
                <div className="text-bolt-elements-textSecondary truncate">{normalizeText(item.description)}</div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="space-y-2">
      <p className="text-xs font-semibold text-bolt-elements-textSecondary uppercase">Секции (добавить)</p>
      <div className="flex flex-col gap-1">
        {sectionPresets.map((p, idx) => (
          <button
            key={`section-${idx}`}
            className="text-left text-sm rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2 hover:border-bolt-elements-focus hover:text-bolt-elements-textPrimary transition-all"
            onClick={() => appendSnippet(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xs font-semibold text-bolt-elements-textSecondary uppercase">Темы (добавить)</p>
      <div className="flex flex-col gap-1">
        {themePresets.map((p, idx) => (
          <button
            key={`theme-${idx}`}
            className="text-left text-sm rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2 hover:border-bolt-elements-focus hover:text-bolt-elements-textPrimary transition-all"
            onClick={() => appendSnippet(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};


