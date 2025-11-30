import { memo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '~/components/ui/shadcn';

export interface PlanningData {
  title: string;
  inspiration?: string[];
  designConcept?: {
    colors?: string;
    effects?: string;
    typography?: string;
    animations?: string;
  };
  features?: string[];
  techStack?: string[];
  steps?: string[];
  status: 'planning' | 'implementing' | 'complete';
}

interface PlanningCardProps {
  data: PlanningData;
  onExpand?: () => void;
}

const statusConfig = {
  planning: {
    icon: 'i-ph:lightbulb-duotone',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    borderColor: 'border-yellow-500/30',
    glowColor: 'shadow-yellow-500/20',
    label: 'Planning...',
    pulseColor: 'bg-yellow-400',
  },
  implementing: {
    icon: 'i-ph:code-duotone',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
    label: 'Implementing...',
    pulseColor: 'bg-blue-400',
  },
  complete: {
    icon: 'i-ph:check-circle-duotone',
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 via-green-500/10 to-transparent',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    label: 'Complete',
    pulseColor: 'bg-emerald-400',
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: 'easeOut' },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

export const PlanningCard = memo(({ data }: PlanningCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const status = statusConfig[data.status];

  const sections = [
    { key: 'inspiration', icon: 'i-ph:sparkle', colorClass: 'text-purple-400', label: 'Inspiration' },
    { key: 'design', icon: 'i-ph:palette', colorClass: 'text-pink-400', label: 'Design' },
    { key: 'features', icon: 'i-ph:list-checks', colorClass: 'text-emerald-400', label: 'Features' },
    { key: 'techStack', icon: 'i-ph:stack', colorClass: 'text-blue-400', label: 'Tech Stack' },
    { key: 'steps', icon: 'i-ph:steps', colorClass: 'text-amber-400', label: 'Steps' },
  ];

  const handleJumpToSection = (key: string) => {
    setActiveSection(key);
    const node = sectionRefs.current[key];
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`overflow-hidden ${status.borderColor} bg-gradient-to-br ${status.bgColor} backdrop-blur-xl shadow-lg ${status.glowColor}`}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full ${status.bgColor} blur-3xl opacity-30`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <CardHeader className="pb-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status indicator with pulse */}
              <div className="relative">
                <motion.div
                  className={`${status.icon} text-2xl ${status.color}`}
                  animate={data.status !== 'complete' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {data.status !== 'complete' && (
                  <motion.div
                    className={`absolute inset-0 ${status.pulseColor} rounded-full opacity-30`}
                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{data.title}</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.pulseColor}`} />
                  {status.label}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Section quick nav dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="i-ph:dots-three-vertical" />
                  </Button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Jump to section</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sections.map((section) => (
                      <DropdownMenuItem
                        key={section.key}
                        onClick={() => handleJumpToSection(section.key)}
                      >
                        <span className={`${section.icon} mr-2 ${section.colorClass}`} />
                        {section.label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Expand/Collapse button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                <motion.span
                  className="i-ph:caret-down"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <CardContent className="pt-2 space-y-4 relative">
                {/* Inspiration */}
                {data.inspiration && data.inspiration.length > 0 && (
                  <motion.div
                    custom={0}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    ref={(el) => {
                      sectionRefs.current['inspiration'] = el;
                    }}
                    className={activeSection === 'inspiration' ? 'ring-1 ring-purple-400/40 rounded-lg p-1' : undefined}
                  >
                    <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1.5">
                      <span className="i-ph:sparkle text-purple-400" />
                      Inspiration
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {data.inspiration.map((item, i) => (
                        <motion.span
                          key={i}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-2.5 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-default hover:bg-purple-500/30 transition-colors"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Design Concept */}
                {data.designConcept && (
                  <motion.div
                    custom={1}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    ref={(el) => {
                      sectionRefs.current['design'] = el;
                    }}
                    className={activeSection === 'design' ? 'ring-1 ring-pink-400/40 rounded-lg p-1' : undefined}
                  >
                    <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1.5">
                      <span className="i-ph:palette text-pink-400" />
                      Design Concept
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {data.designConcept.colors && (
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="i-ph:paint-bucket text-cyan-400 mt-0.5" />
                          <div>
                            <span className="text-white/40 text-[10px] uppercase tracking-wider">Colors</span>
                            <p className="text-white/70">{data.designConcept.colors}</p>
                          </div>
                        </motion.div>
                      )}
                      {data.designConcept.effects && (
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="i-ph:magic-wand text-violet-400 mt-0.5" />
                          <div>
                            <span className="text-white/40 text-[10px] uppercase tracking-wider">Effects</span>
                            <p className="text-white/70">{data.designConcept.effects}</p>
                          </div>
                        </motion.div>
                      )}
                      {data.designConcept.typography && (
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="i-ph:text-aa text-orange-400 mt-0.5" />
                          <div>
                            <span className="text-white/40 text-[10px] uppercase tracking-wider">Typography</span>
                            <p className="text-white/70">{data.designConcept.typography}</p>
                          </div>
                        </motion.div>
                      )}
                      {data.designConcept.animations && (
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="i-ph:play text-green-400 mt-0.5" />
                          <div>
                            <span className="text-white/40 text-[10px] uppercase tracking-wider">Animations</span>
                            <p className="text-white/70">{data.designConcept.animations}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Features */}
                {data.features && data.features.length > 0 && (
                  <motion.div
                    custom={2}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    ref={(el) => {
                      sectionRefs.current['features'] = el;
                    }}
                    className={activeSection === 'features' ? 'ring-1 ring-emerald-400/40 rounded-lg p-1' : undefined}
                  >
                    <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1.5">
                      <span className="i-ph:list-checks text-emerald-400" />
                      Features
                    </h4>
                    <ul className="space-y-1.5">
                      {data.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-2 text-xs text-white/70 group"
                        >
                          <motion.span
                            className="i-ph:check-circle text-emerald-400 text-sm"
                            whileHover={{ scale: 1.2 }}
                          />
                          <span className="group-hover:text-white/90 transition-colors">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Tech Stack */}
                {data.techStack && data.techStack.length > 0 && (
                  <motion.div
                    custom={3}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    ref={(el) => {
                      sectionRefs.current['techStack'] = el;
                    }}
                    className={activeSection === 'techStack' ? 'ring-1 ring-blue-400/40 rounded-lg p-1' : undefined}
                  >
                    <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1.5">
                      <span className="i-ph:stack text-blue-400" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {data.techStack.map((tech, i) => (
                        <motion.span
                          key={i}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-2.5 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-default hover:bg-blue-500/30 transition-colors"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Implementation Steps */}
                {data.steps && data.steps.length > 0 && (
                  <motion.div
                    custom={4}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    ref={(el) => {
                      sectionRefs.current['steps'] = el;
                    }}
                    className={activeSection === 'steps' ? 'ring-1 ring-amber-400/40 rounded-lg p-1' : undefined}
                  >
                    <h4 className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1.5">
                      <span className="i-ph:steps text-amber-400" />
                      Implementation Plan
                    </h4>
                    <ol className="space-y-2">
                      {data.steps.map((step, i) => (
                        <motion.li
                          key={i}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-start gap-2.5 text-xs group"
                        >
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/20 text-amber-400 flex items-center justify-center text-[10px] font-semibold border border-amber-500/30 group-hover:from-amber-500/40 group-hover:to-orange-500/30 transition-all"
                          >
                            {i + 1}
                          </motion.span>
                          <span className="text-white/70 pt-0.5 group-hover:text-white/90 transition-colors">
                            {step}
                          </span>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </CardContent>

              {/* Footer with progress indicator */}
              {data.status === 'implementing' && (
                <CardFooter className="pt-0 pb-3">
                  <div className="w-full">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                      <span>Progress</span>
                      <span>Implementing...</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        initial={{ width: '0%' }}
                        animate={{ width: '60%' }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </CardFooter>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
});

PlanningCard.displayName = 'PlanningCard';
