import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/components/ui/shadcn';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { ScrollArea } from '~/components/ui/ScrollArea';
import { Separator } from '~/components/ui/Separator';
import { Tooltip } from '~/components/ui/Tooltip';
import type { PlanningBlock } from '~/types/planning';

interface PlanningCardProps {
  data: PlanningBlock;
  className?: string;
  onEdit?: () => void;
  onContinue?: () => void;
}

const statusColors = {
  todo: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  in_progress: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  blocked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  skipped: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const statusIcons = {
  todo: 'i-ph:circle',
  in_progress: 'i-ph:spinner-gap animate-spin',
  complete: 'i-ph:check-circle-fill',
  blocked: 'i-ph:x-circle',
  skipped: 'i-ph:minus-circle',
};

export const PlanningCard = memo(({ data, className, onEdit }: PlanningCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'graph'>('overview');

  // Early return if no data
  if (!data) {
    return null;
  }

  const steps = data.steps || [];
  const progress = Math.round(
    (steps.filter((s: any) => s.status === 'complete').length / Math.max(1, steps.length)) * 100,
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={className}>
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-900/5 to-transparent backdrop-blur-xl shadow-lg shadow-purple-500/5 relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20" />
                <div className="relative rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 border border-purple-500/20">
                  <span className="i-ph:kanban-duotone text-xl text-purple-300" />
                </div>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-purple-100 flex items-center gap-2">
                  Development Plan
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-purple-500/10 border-purple-500/20">
                    v{data.version || '1.0'}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-3 text-xs text-purple-300/60">
                  <span className="flex items-center gap-1">
                    <span className="i-ph:steps-duotone" />
                    {steps.length} Steps
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="i-ph:clock-duotone" />
                    Est. {Math.round(steps.length * 5)}m
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden group-hover:flex items-center bg-black/20 rounded-lg p-0.5 border border-white/5 mr-2">
                {(['overview', 'details'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === tab ? 'bg-purple-500/20 text-purple-200' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0 text-white/40">
                  <span className="i-ph:pencil-simple" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8 p-0 text-white/40"
              >
                <motion.span
                  className="i-ph:caret-down"
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-purple-200/50 mb-1.5">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-purple-950/50" />
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator className="bg-white/5" />
              <CardContent className="pt-4 max-h-[400px] overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 -mr-4 pr-4">
                  <div className="space-y-4">
                    {/* Goal & Description */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white/80">Goal</h4>
                      <p className="text-sm text-white/60 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                        {data.goal}
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      <div className="sticky top-0 bg-transparent backdrop-blur-sm pb-2 z-10 flex justify-between items-center">
                        <h4 className="text-sm font-medium text-white/80">Action Plan</h4>
                        <div className="flex gap-2 text-[10px]">
                          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20">
                            {steps.filter((s) => s.status === 'complete').length} Done
                          </Badge>
                          <Badge variant="outline" className="bg-sky-500/5 text-sky-400 border-sky-500/20">
                            {steps.filter((s) => s.status === 'in_progress').length} Active
                          </Badge>
                        </div>
                      </div>

                      <div className="relative pl-4 space-y-4">
                        {/* Timeline Line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/5" />

                        {steps.map((step, index) => (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group/step"
                          >
                            <div className="flex gap-3">
                              {/* Status Dot */}
                              <div
                                className={`
                                  relative z-10 w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center
                                  transition-colors duration-300 bg-[#0A0A0A]
                                  ${
                                    step.status === 'complete'
                                      ? 'border-emerald-500 text-emerald-500'
                                      : step.status === 'in_progress'
                                        ? 'border-sky-500 text-sky-500 '
                                        : 'border-white/10 text-white/20'
                                  }
                                `}
                              >
                                {step.status === 'complete' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                {step.status === 'in_progress' && (
                                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <p
                                      className={`text-sm font-medium leading-none transition-colors ${
                                        step.status === 'complete'
                                          ? 'text-white/40 line-through decoration-white/20'
                                          : step.status === 'in_progress'
                                            ? 'text-sky-300'
                                            : 'text-white/80'
                                      }`}
                                    >
                                      {step.title}
                                    </p>
                                    <p
                                      className={`text-xs leading-relaxed ${
                                        step.status === 'complete' ? 'text-white/20' : 'text-white/50'
                                      }`}
                                    >
                                      {step.description}
                                    </p>
                                  </div>

                                  <Tooltip content={`Step status: ${step.status}`} side="left">
                                    <Badge
                                      variant="outline"
                                      className={`capitalize text-[10px] h-5 px-1.5 whitespace-nowrap ${statusColors[step.status]}`}
                                    >
                                      <span className={`${statusIcons[step.status]} mr-1 text-xs`} />
                                      {step.status.replace('_', ' ')}
                                    </Badge>
                                  </Tooltip>
                                </div>

                                {step.command && (
                                  <div className="mt-2 bg-black/30 rounded border border-white/5 p-2 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                                    <span className="text-emerald-600 mr-2">$</span>
                                    {step.command}
                                  </div>
                                )}

                                {activeTab === 'details' && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-2 text-xs text-white/40 space-y-1 border-l-2 border-white/5 pl-2 ml-1"
                                  >
                                    {/* Additional step details could go here */}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>

              <Separator className="bg-white/5" />
              <CardFooter className="py-3 bg-white/[0.02]">
                <div className="flex items-center justify-between w-full text-xs text-white/30">
                  <span>ID: {(data?.id || 'unknown').slice(0, 8)}</span>
                  <div className="flex gap-4">
                    <span className="flex items-center hover:text-white/50 cursor-pointer transition-colors">
                      <span className="i-ph:bug mr-1.5" />
                      Report Issue
                    </span>
                    <Tooltip
                      content={`Steps: ${steps.length} | Created: ${new Date().toLocaleDateString()}`}
                      side="top"
                    >
                      <span className="flex items-center hover:text-white/50 cursor-pointer transition-colors">
                        <span className="i-ph:info mr-1.5" />
                        Details
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
});

PlanningCard.displayName = 'PlanningCard';
