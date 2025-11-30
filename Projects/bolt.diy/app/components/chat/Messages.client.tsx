import type { Message } from 'ai';
import { Fragment } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { useLocation } from '@remix-run/react';
import { db, chatId } from '~/lib/persistence/useChatHistory';
import { forkChat } from '~/lib/persistence/db';
import { toast } from 'react-toastify';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import type { ProviderInfo } from '~/types/model';
import { Card, CardContent } from '~/components/ui/shadcn';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
  append?: (message: Message) => void;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  model?: string;
  provider?: ProviderInfo;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}

export const Messages = forwardRef<HTMLDivElement, MessagesProps>(
  (props: MessagesProps, ref: ForwardedRef<HTMLDivElement> | undefined) => {
    const { id, isStreaming = false, messages = [] } = props;
    const location = useLocation();

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
      <div id={id} className={props.className} ref={ref}>
        {messages.length > 0
          ? messages.map((message, index) => {
              const { role, content, id: messageId, annotations, parts } = message;
              const isUserMessage = role === 'user';
              const isFirst = index === 0;
              const isHidden = annotations?.includes('hidden');

              if (isHidden) {
                return <Fragment key={index} />;
              }

              return (
                <div
                  key={index}
                  className={classNames('flex gap-4 py-4 w-full', {
                    'mt-2': !isFirst,
                    'border-b border-white/5 pb-6': !isUserMessage && index < messages.length - 1,
                  })}
                >
                  <div className="grid grid-col-1 w-full">
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
        {isStreaming && (
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
