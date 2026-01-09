import type { Message } from 'ai';
import { Fragment } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { GenerationSummaryCard, type GenerationSummary } from './GenerationSummaryCard';
import { UserMessage } from './UserMessage';
import { useLocation } from '@remix-run/react';
import { db, chatId } from '~/lib/persistence/useChatHistory';
import { forkChat } from '~/lib/persistence/db';
import { toast } from 'react-toastify';
import { forwardRef, memo, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import type { ProviderInfo } from '~/types/model';
import { Card, CardContent } from '~/components/ui/shadcn';

const STREAMING_SCAN_MAX_CHARS = 8000;
const STREAMING_SNIPPET_MAX_CHARS = 320;
const STREAMING_ACTION_LIMIT = 6;

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
  generationSummary?: GenerationSummary | null;
  streamingContent?: string;
  append?: (message: Message) => void;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  model?: string;
  provider?: ProviderInfo;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}

const MessagesComponent = forwardRef<HTMLDivElement, MessagesProps>(
  (props: MessagesProps, ref: ForwardedRef<HTMLDivElement> | undefined) => {
    const { id, isStreaming = false, messages = [], generationSummary, streamingContent } = props;
    const location = useLocation();
    const isBuildMode = props.chatMode !== 'discuss';
    const showSummary = Boolean(isStreaming && generationSummary);
    const showStreamingCard = Boolean(isStreaming && isBuildMode);
    const messagesToRender = messages;
    const lastMessageIndex = messagesToRender.length - 1;

    const handleRewind = (messageId: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('rewindTo', messageId);
      window.location.search = searchParams.toString();
    };

    const handleFork = async (messageId: string) => {
      try {
        if (!db || !chatId.get()) {
          toast.error('Chat persistence is not available');
          return;
        }

        const urlId = await forkChat(db, chatId.get()!, messageId);
        window.location.href = `/chat/${urlId}`;
      } catch (error) {
        toast.error('Failed to fork chat: ' + (error as Error).message);
      }
    };

    return (
      <div
        id={id}
        ref={ref}
        className={classNames(
          props.className,

          // Сужаем колонку, чтобы не заходить под правые панели
          'mx-auto w-full max-w-[640px] px-4 sm:px-5',
        )}
      >
        {messagesToRender.length > 0
          ? messagesToRender.map((message, index) => {
              const { role, content, id: messageId, annotations, parts } = message;
              const isUserMessage = role === 'user';
              const isFirst = index === 0;
              const isHidden = annotations?.includes('hidden');

              if (isHidden) {
                return <Fragment key={index} />;
              }

              const hideStreamingAssistant = showStreamingCard && role === 'assistant' && index === lastMessageIndex;

              if (hideStreamingAssistant) {
                return <Fragment key={index} />;
              }

              return (
                <div
                  key={index}
                  className={classNames('flex gap-4 py-4 w-full', {
                    'mt-2': !isFirst,
                    'border-b border-white/5 pb-6': !isUserMessage && index < lastMessageIndex,
                  })}
                >
                  <div className="grid grid-col-1 w-full overflow-hidden">
                    {isUserMessage ? (
                      <UserMessage content={content} parts={parts} />
                    ) : (
                      <Card className="border-white/5 bg-transparent shadow-none">
                        <CardContent className="p-0">
                          <AssistantMessage
                            content={content}
                            annotations={message.annotations}
                            messageId={messageId}
                            onRewind={handleRewind}
                            onFork={handleFork}
                            append={props.append}
                            chatMode={props.chatMode}
                            setChatMode={props.setChatMode}
                            model={props.model}
                            provider={props.provider}
                            parts={parts}
                            addToolResult={props.addToolResult}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              );
            })
          : null}
        {showSummary && generationSummary && (
          <div className="flex gap-4 py-4 w-full">
            <div className="grid grid-col-1 w-full overflow-hidden">
              <GenerationSummaryCard summary={generationSummary} />
            </div>
          </div>
        )}
        {showStreamingCard && (
          <div className="flex gap-4 py-4 w-full">
            <div className="grid grid-col-1 w-full overflow-hidden">
              <StreamingAssistantMessage content={streamingContent ?? ''} />
            </div>
          </div>
        )}
        {isStreaming && !generationSummary && !showStreamingCard && (
          <Card className="mt-4 border-purple-500/20 bg-purple-500/5">
            <CardContent className="p-4 flex items-center justify-center">
              <div className="text-purple-400 i-svg-spinners:3-dots-fade text-3xl"></div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
);

export const Messages = memo(MessagesComponent);

type StreamingAction = { key: string; label: string };

function stripBoltTags(content: string) {
  return content
    .replace(/<boltAction[^>]*>/gi, '')
    .replace(/<\/boltAction>/gi, '')
    .replace(/<boltArtifact[^>]*>/gi, '')
    .replace(/<\/boltArtifact>/gi, '');
}

function extractStreamingActions(content: string): StreamingAction[] {
  const actions: StreamingAction[] = [];
  const seen = new Set<string>();
  const tagRegex = /<boltAction\s+[^>]*type="([^"]+)"[^>]*>/gi;
  const fileRegex = /<boltAction\s+[^>]*type="file"[^>]*filePath="([^"]+)"/gi;
  let match: RegExpExecArray | null;

  while ((match = fileRegex.exec(content)) !== null) {
    const filePath = match[1];
    const key = `file:${filePath}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    actions.push({ key, label: `Create ${filePath}` });
  }

  while ((match = tagRegex.exec(content)) !== null) {
    const type = match[1];

    if (type === 'file') {
      continue;
    }

    const key = `action:${type}:${match.index}`;
    actions.push({ key, label: `Action: ${type}` });
  }

  return actions.slice(0, STREAMING_ACTION_LIMIT);
}

function StreamingAssistantMessage({ content }: { content: string }) {
  const { actions, snippet } = useMemo(() => {
    const scanSource = content.length > STREAMING_SCAN_MAX_CHARS ? content.slice(-STREAMING_SCAN_MAX_CHARS) : content;
    const hasActions = scanSource.includes('<boltAction');
    const cleaned = stripBoltTags(scanSource).trim();
    const tail = cleaned.slice(-STREAMING_SNIPPET_MAX_CHARS);

    return {
      actions: hasActions ? extractStreamingActions(scanSource) : [],
      snippet: tail,
    };
  }, [content]);

  return (
    <Card className="border-purple-500/20 bg-purple-500/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-purple-300">
          <div className="i-svg-spinners:3-dots-fade text-2xl" />
          <span className="text-sm">Generating...</span>
        </div>
        {actions.length > 0 && (
          <div className="text-xs text-bolt-elements-textSecondary">
            <div className="mb-1 font-semibold text-bolt-elements-textPrimary">Detected actions</div>
            <ul className="space-y-1">
              {actions.map((action) => (
                <li key={action.key} className="truncate">
                  {action.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        {snippet && (
          <pre className="text-xs text-bolt-elements-textTertiary whitespace-pre-wrap max-h-24 overflow-hidden">
            {snippet}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
