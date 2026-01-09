import type { Message } from 'ai';
import { useCallback, useRef, useState } from 'react';
import { EnhancedStreamingMessageParser } from '~/lib/runtime/enhanced-message-parser';
import { workbenchStore } from '~/lib/stores/workbench';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('useMessageParser');

const messageParser = new EnhancedStreamingMessageParser({
  callbacks: {
    onArtifactOpen: (data) => {
      logger.trace('onArtifactOpen', data);

      workbenchStore.showWorkbench.set(true);
      workbenchStore.addArtifact(data);

      // Don't auto-switch tabs - let user control navigation
    },
    onArtifactClose: (data) => {
      logger.trace('onArtifactClose');

      workbenchStore.updateArtifact(data, { closed: true });
    },
    onActionOpen: (data) => {
      logger.trace('onActionOpen', data.action);

      /*
       * File actions are streamed, so we add them immediately to show progress
       * Shell actions are complete when created by enhanced parser, so we wait for close
       */
      if (data.action.type === 'file') {
        workbenchStore.addAction(data);
      }
    },
    onActionClose: (data) => {
      logger.trace('onActionClose', data.action);

      /*
       * Add non-file actions (shell, build, start, etc.) when they close
       * Enhanced parser creates complete shell actions, so they're ready to execute
       */
      if (data.action.type !== 'file') {
        workbenchStore.addAction(data);
      }

      workbenchStore.runAction(data);
    },
    onActionStream: (data) => {
      logger.trace('onActionStream', data.action);

      if (data.action.type !== 'file') {
        workbenchStore.runAction(data, true);
      }
    },
  },
});
const extractTextContent = (message: Message) =>
  Array.isArray(message.content)
    ? (message.content.find((item) => item.type === 'text')?.text as string) || ''
    : message.content;

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{ [key: number]: string }>({});
  const parsedMessagesRef = useRef<{ [key: number]: string }>({});
  const lastParsedCountRef = useRef(0);

  const parseMessages = useCallback((messages: Message[], isLoading: boolean) => {
    let reset = false;

    if (import.meta.env.DEV && !isLoading) {
      reset = true;
      messageParser.reset();
      parsedMessagesRef.current = {};
      lastParsedCountRef.current = 0;
    }

    if (messages.length === 0) {
      if (reset) {
        setParsedMessages({});
      }

      return;
    }

    const nextParsed = reset ? {} : { ...parsedMessagesRef.current };
    let updated = false;

    const parseAtIndex = (index: number, finalize: boolean) => {
      const message = messages[index];

      if (!message || message.role !== 'assistant') {
        return;
      }

      const newParsedContent = messageParser.parse(message.id, extractTextContent(message));

      if (finalize) {
        messageParser.finalize(message.id);
      }

      if (newParsedContent) {
        nextParsed[index] = (nextParsed[index] || '') + newParsedContent;
        updated = true;
      }
    };

    if (isLoading) {
      let lastAssistantIndex = -1;

      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') {
          lastAssistantIndex = i;
          break;
        }
      }

      if (lastAssistantIndex >= 0) {
        parseAtIndex(lastAssistantIndex, false);
      }

      lastParsedCountRef.current = messages.length;
    } else {
      const startIndex = reset ? 0 : Math.max(0, lastParsedCountRef.current - 1);

      for (let i = startIndex; i < messages.length; i++) {
        parseAtIndex(i, true);
      }
      lastParsedCountRef.current = messages.length;
    }

    if (updated || reset) {
      parsedMessagesRef.current = nextParsed;
      setParsedMessages(nextParsed);
    }
  }, []);

  return { parsedMessages, parseMessages };
}
