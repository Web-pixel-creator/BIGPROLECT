/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */
import type { JSONValue, Message } from 'ai';
import React, { type RefCallback, useCallback, useEffect, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { Messages } from './Messages.client';
import { getApiKeysFromCookies } from './APIKeyManager';
import Cookies from 'js-cookie';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './BaseChat.module.scss';
import { ImportButtons } from '~/components/chat/chatExportAndImport/ImportButtons';
import { ExamplePrompts } from '~/components/chat/ExamplePrompts';
import GitCloneButton from './GitCloneButton';
import type { ProviderInfo } from '~/types/model';
import StarterTemplates from './StarterTemplates';
import { RecentChats } from './RecentChats';
import type { ActionAlert, SupabaseAlert, DeployAlert, LlmErrorAlertType } from '~/types/actions';
import DeployChatAlert from '~/components/deploy/DeployAlert';
import ChatAlert from './ChatAlert';
import type { ModelInfo } from '~/lib/modules/llm/types';
import ProgressCompilation from './ProgressCompilation';
import type { ProgressAnnotation } from '~/types/context';
import { SupabaseChatAlert } from '~/components/chat/SupabaseAlert';
import { expoUrlAtom } from '~/lib/stores/qrCodeStore';
import { useStore } from '@nanostores/react';
import useViewport, { StickToBottom, useStickToBottomContext } from '~/lib/hooks';
import { ChatBox } from './ChatBox';
import type { GenerationSummary } from './GenerationSummaryCard';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import LlmErrorAlert from './LLMApiAlert';
import { workbenchStore } from '~/lib/stores/workbench';
import { BriefForm } from './BriefForm';
import { InputModeSelector, type InputMode } from './InputModeSelector';
import { PromptGenerator, type Brief } from '~/lib/services/promptGenerator';

const TEXTAREA_MIN_HEIGHT = 76;
const STREAMING_CONTENT_MAX_CHARS = 8000;
const STREAMING_UPDATE_INTERVAL_MS = 400;
const STREAMING_SCROLL_RESET_PX = 6;

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  onStreamingChange?: (streaming: boolean) => void;
  messages?: Message[];
  description?: string;
  generationSummary?: GenerationSummary | null;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => Promise<boolean> | boolean;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  uploadedFiles?: File[];
  setUploadedFiles?: (files: File[]) => void;
  imageDataList?: string[];
  setImageDataList?: (dataList: string[]) => void;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
  supabaseAlert?: SupabaseAlert;
  clearSupabaseAlert?: () => void;
  deployAlert?: DeployAlert;
  clearDeployAlert?: () => void;
  llmErrorAlert?: LlmErrorAlertType;
  clearLlmErrorAlert?: () => void;
  data?: JSONValue[] | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  append?: (message: Message) => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: (element: ElementInfo | null) => void;
  addToolResult?: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      onStreamingChange,
      model,
      setModel,
      provider,
      setProvider,
      providerList,
      input = '',
      enhancingPrompt,
      handleInputChange,

      // promptEnhanced,
      enhancePrompt,
      sendMessage,
      handleStop,
      importChat,
      exportChat,
      uploadedFiles = [],
      setUploadedFiles,
      imageDataList = [],
      setImageDataList,
      messages,
      generationSummary,
      actionAlert,
      clearAlert,
      deployAlert,
      clearDeployAlert,
      supabaseAlert,
      clearSupabaseAlert,
      llmErrorAlert,
      clearLlmErrorAlert,
      data,
      chatMode,
      setChatMode,
      append,
      designScheme,
      setDesignScheme,
      selectedElement,
      setSelectedElement,
      addToolResult = () => {
        throw new Error('addToolResult not implemented');
      },
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [apiKeys, setApiKeys] = useState<Record<string, string>>(getApiKeysFromCookies());
    const [modelList, setModelList] = useState<ModelInfo[]>([]);
    const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [transcript, setTranscript] = useState('');
    const [isModelLoading, setIsModelLoading] = useState<string | undefined>('all');
    const [progressAnnotations, setProgressAnnotations] = useState<ProgressAnnotation[]>([]);
    const [inputMode, setInputMode] = useState<InputMode>('brief');
    const [isBriefLoading, setIsBriefLoading] = useState(false);
    const [lastGeneratedSeed, setLastGeneratedSeed] = useState<number | null>(null);
    const progressKeyRef = useRef('');
    const expoUrl = useStore(expoUrlAtom);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const showWorkbench = useStore(workbenchStore.showWorkbench);
    const isSmallViewport = useViewport(1024);
    const constrainChatWidth = showWorkbench && !isSmallViewport;

    // Handle BriefForm submission
    const handleBriefSubmit = useCallback(async (brief: Brief) => {
      if (!sendMessage) return;
      
      setIsBriefLoading(true);
      try {
        const generator = new PromptGenerator();
        const result = generator.generate(brief);
        setLastGeneratedSeed(result.seed);
        await sendMessage({} as React.UIEvent, result.prompt);
      } finally {
        setIsBriefLoading(false);
      }
    }, [sendMessage]);

    const handleCopySeed = useCallback(() => {
      if (lastGeneratedSeed !== null) {
        navigator.clipboard.writeText(String(lastGeneratedSeed));
      }
    }, [lastGeneratedSeed]);

    useEffect(() => {
      if (expoUrl) {
        setQrModalOpen(true);
      }
    }, [expoUrl]);

    useEffect(() => {
      if (!data) {
        if (progressKeyRef.current !== '') {
          progressKeyRef.current = '';
          setProgressAnnotations([]);
        }

        return;
      }

      const progressList = data.filter(
        (x) => typeof x === 'object' && (x as any).type === 'progress',
      ) as ProgressAnnotation[];
      const progressKey = progressList
        .map((item) => `${item.label}:${item.status}:${item.order}:${item.message}`)
        .join('|');

      if (progressKeyRef.current !== progressKey) {
        progressKeyRef.current = progressKey;
        setProgressAnnotations(progressList);
      }
    }, [data]);
    useEffect(() => {
      console.log(transcript);
    }, [transcript]);

    useEffect(() => {
      onStreamingChange?.(isStreaming);
    }, [isStreaming, onStreamingChange]);

    useEffect(() => {
      if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          setTranscript(transcript);

          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: transcript },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        let parsedApiKeys: Record<string, string> | undefined = {};

        try {
          parsedApiKeys = getApiKeysFromCookies();
          setApiKeys(parsedApiKeys);
        } catch (error) {
          console.error('Error loading API keys from cookies:', error);
          Cookies.remove('apiKeys');
        }

        setIsModelLoading('all');
        fetch('/api/models')
          .then((response) => response.json())
          .then((data) => {
            const typedData = data as { modelList: ModelInfo[] };
            setModelList(typedData.modelList);
          })
          .catch((error) => {
            console.error('Error fetching model list:', error);
          })
          .finally(() => {
            setIsModelLoading(undefined);
          });
      }
    }, [providerList, provider]);

    const onApiKeysChange = async (providerName: string, apiKey: string) => {
      const newApiKeys = { ...apiKeys, [providerName]: apiKey };
      setApiKeys(newApiKeys);
      Cookies.set('apiKeys', JSON.stringify(newApiKeys));

      setIsModelLoading(providerName);

      let providerModels: ModelInfo[] = [];

      try {
        const response = await fetch(`/api/models/${encodeURIComponent(providerName)}`);
        const data = await response.json();
        providerModels = (data as { modelList: ModelInfo[] }).modelList;
      } catch (error) {
        console.error('Error loading dynamic models for:', providerName, error);
      }

      // Only update models for the specific provider
      setModelList((prevModels) => {
        const otherModels = prevModels.filter((model) => model.provider !== providerName);
        return [...otherModels, ...providerModels];
      });
      setIsModelLoading(undefined);
    };

    const startListening = () => {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      }
    };

    const stopListening = () => {
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
    };

    const handleSendMessage = async (event: React.UIEvent, messageInput?: string) => {
      if (!sendMessage) {
        return;
      }

      const fallbackValue = messageInput ?? input;
      let sent = false;

      try {
        const result = await sendMessage(event, messageInput);
        sent = typeof result === 'boolean' ? result : true;
      } catch (error) {
        console.error('sendMessage failed', error);
        sent = false;
      }

      if (sent) {
        setSelectedElement?.(null);

        if (recognition) {
          recognition.abort();
          setTranscript('');
          setIsListening(false);

          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: '' },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        }
      } else if (fallbackValue && handleInputChange) {
        const syntheticEvent = {
          target: { value: fallbackValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        handleInputChange(syntheticEvent);
      }
    };

    const handleFileUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            setUploadedFiles?.([...uploadedFiles, file]);
            setImageDataList?.([...imageDataList, base64Image]);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();

          const file = item.getAsFile();

          if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
              const base64Image = e.target?.result as string;
              setUploadedFiles?.([...uploadedFiles, file]);
              setImageDataList?.([...imageDataList, base64Image]);
            };
            reader.readAsDataURL(file);
          }

          break;
        }
      }
    };

    const targetScrollTop = useCallback(
      (target: number, { scrollElement }: { scrollElement: HTMLElement }) => {
        if (enhancingPrompt) {
          return scrollElement.scrollTop;
        }

        if (isStreaming) {
          const maxScrollTop = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight - 1);
          const distanceFromBottom = Math.abs(maxScrollTop - scrollElement.scrollTop);

          if (userScrolledRef.current || distanceFromBottom > 8) {
            return scrollElement.scrollTop;
          }
        }

        return target;
      },
      [enhancingPrompt, isStreaming],
    );

    const stableMessagesRef = useRef<Message[]>(messages ? [...messages] : []);
    const stableMessageCountRef = useRef(messages ? messages.length : 0);
    const [streamingContent, setStreamingContent] = useState('');
    const streamingContentRef = useRef('');
    const streamingUpdateRef = useRef({ timeoutId: null as null | ReturnType<typeof setTimeout>, lastUpdate: 0 });
    const userScrolledRef = useRef(false);

    useEffect(() => {
      return () => {
        if (streamingUpdateRef.current.timeoutId) {
          clearTimeout(streamingUpdateRef.current.timeoutId);
          streamingUpdateRef.current.timeoutId = null;
        }
      };
    }, []);

    useEffect(() => {
      if (!messages) {
        if (streamingContentRef.current !== '') {
          streamingContentRef.current = '';
          setStreamingContent('');
        }

        return;
      }

      const lastMessage = messages[messages.length - 1];

      if (isStreaming && lastMessage?.role === 'assistant' && typeof lastMessage.content === 'string') {
        const maxChars = STREAMING_CONTENT_MAX_CHARS;
        const nextContent =
          lastMessage.content.length > maxChars ? lastMessage.content.slice(-maxChars) : lastMessage.content;

        if (streamingContentRef.current !== nextContent) {
          streamingContentRef.current = nextContent;

          const now = Date.now();
          const elapsed = now - streamingUpdateRef.current.lastUpdate;
          const applyUpdate = () => {
            streamingUpdateRef.current.lastUpdate = Date.now();
            setStreamingContent(streamingContentRef.current);
          };

          if (elapsed >= STREAMING_UPDATE_INTERVAL_MS) {
            if (streamingUpdateRef.current.timeoutId) {
              clearTimeout(streamingUpdateRef.current.timeoutId);
              streamingUpdateRef.current.timeoutId = null;
            }

            applyUpdate();
          } else if (!streamingUpdateRef.current.timeoutId) {
            streamingUpdateRef.current.timeoutId = setTimeout(() => {
              streamingUpdateRef.current.timeoutId = null;
              applyUpdate();
            }, STREAMING_UPDATE_INTERVAL_MS - elapsed);
          }
        }
      } else if (streamingContentRef.current !== '') {
        streamingContentRef.current = '';
        setStreamingContent('');

        if (streamingUpdateRef.current.timeoutId) {
          clearTimeout(streamingUpdateRef.current.timeoutId);
          streamingUpdateRef.current.timeoutId = null;
        }

        userScrolledRef.current = false;
      }

      const messageCount = messages.length;

      if (messageCount !== stableMessageCountRef.current) {
        stableMessageCountRef.current = messageCount;

        if (isStreaming && lastMessage?.role === 'assistant') {
          stableMessagesRef.current = messages.slice(0, -1);
        } else {
          stableMessagesRef.current = messages.slice();
        }
      } else if (!isStreaming || lastMessage?.role === 'user') {
        stableMessagesRef.current = messages.slice();
      }
    }, [isStreaming, messages]);

    const scrollBehavior = isStreaming ? 'instant' : 'smooth';

    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex h-full w-full overflow-hidden')}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div className="flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden w-full h-full">
          <div
            className={classNames(
              styles.Chat,
              'flex flex-col flex-grow min-w-0 lg:min-w-[var(--chat-min-width)] h-full',
              {
                'lg:w-[var(--workbench-left)] lg:max-w-[var(--workbench-left)]': constrainChatWidth,
              },
            )}
          >
            {!chatStarted && (
              <div id="intro" className="mt-[16vh] max-w-2xl mx-auto text-center px-4 lg:px-0">
                <h1 className="text-3xl lg:text-6xl font-bold text-bolt-elements-textPrimary mb-4 animate-fade-in">
                  Where ideas begin
                </h1>
                <p className="text-md lg:text-xl mb-8 text-bolt-elements-textSecondary animate-fade-in animation-delay-200">
                  Bring ideas to life in seconds or get help on existing projects.
                </p>
              </div>
            )}
            <StickToBottom
              className={classNames('pt-6 px-4 sm:px-6 lg:px-8 relative w-full min-w-0', {
                'h-full flex flex-col modern-scrollbar': chatStarted,
              })}
              resize={scrollBehavior}
              initial={scrollBehavior}
              targetScrollTop={targetScrollTop}
            >
              <StickToBottom.Content className="flex flex-col gap-4 relative items-center">
                <ClientOnly>
                  {() => {
                    return chatStarted ? (
                      <Messages
                        className="flex flex-col w-full flex-1 max-w-[640px] px-4 sm:px-5 pb-4 mx-auto z-1"
                        messages={isStreaming ? stableMessagesRef.current : (messages ?? stableMessagesRef.current)}
                        isStreaming={isStreaming}
                        generationSummary={generationSummary}
                        streamingContent={isStreaming ? streamingContent : ''}
                        append={append}
                        chatMode={chatMode}
                        setChatMode={setChatMode}
                        provider={provider}
                        model={model}
                        addToolResult={addToolResult}
                      />
                    ) : null;
                  }}
                </ClientOnly>
                <ScrollActivityWatcher isStreaming={isStreaming} userScrolledRef={userScrolledRef} />
                <ScrollToBottom />
              </StickToBottom.Content>
              <div
                className={classNames('flex flex-col gap-2 w-full max-w-[640px] px-4 sm:px-5 mx-auto z-prompt mb-6', {
                  'sticky bottom-2': chatStarted,
                })}
              >
                <div className="flex flex-col gap-2">
                  {deployAlert && (
                    <DeployChatAlert
                      alert={deployAlert}
                      clearAlert={() => clearDeployAlert?.()}
                      postMessage={(message: string | undefined) => {
                        sendMessage?.({} as any, message);
                        clearSupabaseAlert?.();
                      }}
                    />
                  )}
                  {supabaseAlert && (
                    <SupabaseChatAlert
                      alert={supabaseAlert}
                      clearAlert={() => clearSupabaseAlert?.()}
                      postMessage={(message) => {
                        sendMessage?.({} as any, message);
                        clearSupabaseAlert?.();
                      }}
                    />
                  )}
                  {actionAlert && (
                    <ChatAlert
                      alert={actionAlert}
                      clearAlert={() => clearAlert?.()}
                      postMessage={(message) => {
                        sendMessage?.({} as any, message);
                        clearAlert?.();
                      }}
                    />
                  )}
                  {llmErrorAlert && <LlmErrorAlert alert={llmErrorAlert} clearAlert={() => clearLlmErrorAlert?.()} />}
                </div>
                {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                <ChatBox
                  isModelSettingsCollapsed={isModelSettingsCollapsed}
                  setIsModelSettingsCollapsed={setIsModelSettingsCollapsed}
                  provider={provider}
                  setProvider={setProvider}
                  providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                  model={model}
                  setModel={setModel}
                  modelList={modelList}
                  apiKeys={apiKeys}
                  isModelLoading={isModelLoading}
                  onApiKeysChange={onApiKeysChange}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  imageDataList={imageDataList}
                  setImageDataList={setImageDataList}
                  textareaRef={textareaRef}
                  input={input}
                  handleInputChange={handleInputChange}
                  handlePaste={handlePaste}
                  TEXTAREA_MIN_HEIGHT={TEXTAREA_MIN_HEIGHT}
                  TEXTAREA_MAX_HEIGHT={TEXTAREA_MAX_HEIGHT}
                  isStreaming={isStreaming}
                  handleStop={handleStop}
                  handleSendMessage={handleSendMessage}
                  enhancingPrompt={enhancingPrompt}
                  enhancePrompt={enhancePrompt}
                  isListening={isListening}
                  startListening={startListening}
                  stopListening={stopListening}
                  chatStarted={chatStarted}
                  exportChat={exportChat}
                  qrModalOpen={qrModalOpen}
                  setQrModalOpen={setQrModalOpen}
                  handleFileUpload={handleFileUpload}
                  chatMode={chatMode}
                  setChatMode={setChatMode}
                  designScheme={designScheme}
                  setDesignScheme={setDesignScheme}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                />
              </div>
            </StickToBottom>
            {!chatStarted && (
              <>
                <div className="mt-6">
                  <RecentChats />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-center gap-2 mb-4">
                    {ImportButtons(importChat)}
                    <GitCloneButton importChat={importChat} />
                  </div>
                  
                  {/* Input Mode Selector */}
                  <div className="flex justify-center mb-6">
                    <InputModeSelector mode={inputMode} onChange={setInputMode} />
                  </div>
                  
                  {inputMode === 'brief' ? (
                    <div className="max-w-xl mx-auto w-full px-4">
                      <BriefForm onSubmit={handleBriefSubmit} isLoading={isBriefLoading} />
                      {lastGeneratedSeed !== null && (
                        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-bolt-elements-textTertiary">
                          <span>Seed: {lastGeneratedSeed}</span>
                          <button
                            type="button"
                            onClick={handleCopySeed}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-bolt-elements-background-depth-3 hover:bg-bolt-elements-background-depth-4 transition-colors"
                            title="Copy seed for reproducibility"
                          >
                            <span className="i-ph:copy text-xs" />
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <ExamplePrompts
                        onSelect={(prompt) => {
                          if (isStreaming) {
                            handleStop?.();
                            return;
                          }

                          handleSendMessage?.({} as unknown as React.UIEvent, prompt);
                        }}
                      />
                      <StarterTemplates />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <ClientOnly>
            {() => (
              <Workbench chatStarted={chatStarted} isStreaming={isStreaming} setSelectedElement={setSelectedElement} />
            )}
          </ClientOnly>
        </div>
      </div>
    );

    return <Tooltip.Provider delayDuration={200}>{baseChat}</Tooltip.Provider>;
  },
);

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <>
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-bolt-elements-background-depth-1 to-transparent h-20 z-10" />
        <button
          className="sticky z-50 bottom-0 left-0 right-0 text-4xl rounded-lg px-1.5 py-0.5 flex items-center justify-center mx-auto gap-2 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor text-bolt-elements-textPrimary text-sm"
          onClick={() => scrollToBottom()}
        >
          Go to last message
          <span className="i-ph:arrow-down animate-bounce" />
        </button>
      </>
    )
  );
}

function ScrollActivityWatcher({
  isStreaming,
  userScrolledRef,
}: {
  isStreaming: boolean;
  userScrolledRef: React.MutableRefObject<boolean>;
}) {
  const { scrollRef } = useStickToBottomContext();

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    const node = scrollRef.current;

    if (!node) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight);
      const distanceFromBottom = Math.abs(maxScrollTop - node.scrollTop);
      userScrolledRef.current = distanceFromBottom > STREAMING_SCROLL_RESET_PX;
    };

    updateScrollState();
    node.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      node.removeEventListener('scroll', updateScrollState);
    };
  }, [isStreaming, scrollRef, userScrolledRef]);

  return null;
}
