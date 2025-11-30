import { Fragment, memo, useMemo } from 'react';
import type { JSONValue, Message } from 'ai';
import { Markdown } from './Markdown';
import Popover from '~/components/ui/Popover';
import WithTooltip from '~/components/ui/Tooltip';
import { workbenchStore } from '~/lib/stores/workbench';
import { WORK_DIR } from '~/utils/constants';
import type { ProviderInfo } from '~/types/model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '~/components/ui/shadcn';
import type {
  FileUIPart,
  ReasoningUIPart,
  SourceUIPart,
  StepStartUIPart,
  TextUIPart,
  ToolInvocationUIPart,
} from '@ai-sdk/ui-utils';
import { ToolInvocations } from './ToolInvocations';
import type { ToolCallAnnotation } from '~/types/context';
import { PlanningCard } from './PlanningCard';
import { WhatsNextCard } from './WhatsNextCard';
import { parsePlanningBlock, updatePlanningStatus } from '~/lib/runtime/planning-parser';

interface AssistantMessageProps {
  content: string;
  annotations?: JSONValue[];
  messageId?: string;
  onRewind?: (messageId: string) => void;
  onFork?: (messageId: string) => void;
  append?: (message: Message) => void;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  model?: string;
  provider?: ProviderInfo;
  parts:
    | (TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart)[]
    | undefined;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}

function normalizedFilePath(path: string) {
  let normalizedPath = path;

  if (normalizedPath.startsWith(WORK_DIR)) {
    normalizedPath = normalizedPath.replace(WORK_DIR, '');
  }

  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.slice(1);
  }

  return normalizedPath;
}

function openArtifactInWorkbench(filePath: string) {
  workbenchStore.setSelectedFile(`${WORK_DIR}/${normalizedFilePath(filePath)}`);
}

export const AssistantMessage = memo(
  ({
    content,
    annotations,
    messageId,
    onRewind,
    onFork,
    append,
    chatMode,
    setChatMode,
    model,
    provider,
    parts,
    addToolResult,
  }: AssistantMessageProps) => {
    const filteredAnnotations = (annotations?.filter(
      (annotation: JSONValue) =>
        annotation && typeof annotation === 'object' && 'type' in annotation,
    ) || []) as { type: string; value: any } & { [key: string]: any }[];

    const chatSummary = filteredAnnotations.find((a) => a.type === 'chatSummary')?.summary as
      | string
      | undefined;
    const codeContext = filteredAnnotations.find((a) => a.type === 'codeContext')?.files as
      | string[]
      | undefined;

    const usage =
      (filteredAnnotations.find((a) => a.type === 'usage')?.value as
        | {
            completionTokens: number;
            promptTokens: number;
            totalTokens: number;
          }
        | undefined) ?? undefined;

    const toolInvocations = parts?.filter((part) => part.type === 'tool-invocation');
    const toolCallAnnotations = filteredAnnotations.filter(
      (annotation) => annotation.type === 'toolCall',
    ) as ToolCallAnnotation[];

    const { planning, cleanContent } = useMemo(() => {
      const result = parsePlanningBlock(content);
      if (result.planning) {
        const hasArtifacts = content.includes('<boltArtifact');
        const isComplete = content.includes('</boltArtifact>') && !content.includes('<boltArtifact');
        return {
          planning: updatePlanningStatus(result.planning, hasArtifacts, isComplete),
          cleanContent: result.cleanContent,
        };
      }
      return result;
    }, [content]);

    return (
      <div className="overflow-hidden w-full">
        {planning && (
          <div className="mb-4">
            <PlanningCard data={planning} />
          </div>
        )}

        <div className="flex gap-2 items-center text-sm text-bolt-elements-textSecondary mb-3">
          {(codeContext || chatSummary) && (
            <Popover
              side="right"
              align="start"
              trigger={
                <div className="i-ph:info text-purple-400 hover:text-purple-300 cursor-pointer" />
              }
            >
              {chatSummary && (
                <Card className="max-w-chat">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div style={{ zoom: 0.8 }}>
                      <Markdown>{chatSummary}</Markdown>
                    </div>
                  </CardContent>
                  {codeContext && (
                    <CardContent className="pt-0">
                      <h4 className="text-sm font-medium text-white/80 mb-2">Context Files</h4>
                      <div className="flex flex-wrap gap-2" style={{ zoom: 0.7 }}>
                        {codeContext.map((x) => {
                          const normalized = normalizedFilePath(x);
                          return (
                            <Fragment key={normalized}>
                              <code
                                className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md hover:bg-purple-500/30 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openArtifactInWorkbench(normalized);
                                }}
                              >
                                {normalized}
                              </code>
                            </Fragment>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}
            </Popover>
          )}
          <div className="flex w-full items-center justify-between">
            {usage && (
              <div className="text-xs text-white/70 bg-white/5 px-2 py-1 rounded-md flex items-center gap-2">
                <span className="text-purple-300 font-semibold">{usage.totalTokens}</span>
                <span className="text-white/50">tokens</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60">prompt</span>
                <span className="text-white/70">{usage.promptTokens}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60">completion</span>
                <span className="text-white/70">{usage.completionTokens}</span>
              </div>
            )}
            {(onRewind || onFork) && messageId && (
              <div className="flex gap-1 ml-auto">
                {onRewind && (
                  <WithTooltip tooltip="Revert to this message">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRewind(messageId)}
                      className="h-7 w-7 p-0"
                    >
                      <span className="i-ph:arrow-u-up-left text-lg" />
                    </Button>
                  </WithTooltip>
                )}
                {onFork && (
                  <WithTooltip tooltip="Fork chat from this message">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFork(messageId)}
                      className="h-7 w-7 p-0"
                    >
                      <span className="i-ph:git-fork text-lg" />
                    </Button>
                  </WithTooltip>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <Markdown
            append={append}
            chatMode={chatMode}
            setChatMode={setChatMode}
            model={model}
            provider={provider}
            html
          >
            {planning ? cleanContent : content}
          </Markdown>
        </div>

        {toolInvocations && toolInvocations.length > 0 && (
          <div className="mt-3">
            <ToolInvocations
              toolInvocations={toolInvocations}
              toolCallAnnotations={toolCallAnnotations}
              addToolResult={addToolResult}
            />
          </div>
        )}

        {planning && planning.status === 'complete' && (
          <WhatsNextCard
            actions={[
              {
                icon: 'i-ph:paint-brush-duotone',
                title: 'Refine & Customize',
                description: 'Adjust colors, styles, and animations through prompts',
                action: () => {},
              },
              {
                icon: 'i-ph:chat-circle-text-duotone',
                title: 'Chat Mode',
                description: 'Use chat mode to plan new features',
                action: () => setChatMode?.('discuss'),
              },
              {
                icon: 'i-ph:code-duotone',
                title: 'Explore Code',
                description: 'Open Workbench to view generated code',
                action: () => workbenchStore.showWorkbench.set(true),
              },
            ]}
          />
        )}
      </div>
    );
  },
);
