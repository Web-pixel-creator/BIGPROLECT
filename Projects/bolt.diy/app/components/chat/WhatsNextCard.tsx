import { memo, useState } from 'react';
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

interface WhatsNextAction {
  icon: string;
  title: string;
  description: string;
  action?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

interface WhatsNextCardProps {
  title?: string;
  subtitle?: string;
  actions?: WhatsNextAction[];
  showConfetti?: boolean;
}

const defaultActions: WhatsNextAction[] = [
  {
    icon: 'i-ph:paint-brush-duotone',
    title: 'Refine & Customize',
    description: 'Adjust colors, styles, and animations',
    variant: 'default',
  },
  {
    icon: 'i-ph:chat-circle-text-duotone',
    title: 'Master Prompting',
    description: 'Use chat mode to plan new features',
    variant: 'default',
  },
  {
    icon: 'i-ph:code-duotone',
    title: 'Explore Code',
    description: 'Open Workbench to view code',
    variant: 'default',
  },
  {
    icon: 'i-ph:rocket-launch-duotone',
    title: 'Deploy',
    description: 'Deploy to Netlify or other platforms',
    variant: 'primary',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const actionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.3 },
  }),
};

export const WhatsNextCard = memo(
  ({
    title = "What's next?",
    subtitle = 'Your project is ready!',
    actions = defaultActions,
  }: WhatsNextCardProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [hoveredAction, setHoveredAction] = useState<number | null>(null);

    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className="relative mt-4">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent backdrop-blur-xl shadow-lg shadow-emerald-500/10 overflow-hidden">
          <CardHeader className="pb-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <span className="i-ph:sparkle-duotone text-2xl text-emerald-400" />
                </motion.div>
                <div>
                  <CardTitle className="text-base font-semibold text-emerald-300">{title}</CardTitle>
                  <CardDescription className="text-xs text-emerald-400/70">{subtitle}</CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-400">
                      <span className="i-ph:dots-three-vertical" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span className="i-ph:share mr-2" />
                      Share Project
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="i-ph:download mr-2" />
                      Export Code
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0 text-emerald-400"
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
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-2 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actions.map((action, index) => (
                      <motion.button
                        key={index}
                        custom={index}
                        variants={actionVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.action}
                        onMouseEnter={() => setHoveredAction(index)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className={`relative flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                          action.variant === 'primary'
                            ? 'bg-gradient-to-br from-emerald-500/30 to-green-500/20 border border-emerald-500/40'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <motion.div
                          className={`${action.icon} text-xl ${
                            action.variant === 'primary' ? 'text-emerald-300' : 'text-emerald-400'
                          }`}
                          animate={hoveredAction === index ? { scale: 1.1 } : { scale: 1 }}
                        />
                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              action.variant === 'primary' ? 'text-emerald-200' : 'text-white/90'
                            }`}
                          >
                            {action.title}
                          </h4>
                          <p className="text-xs text-white/50 mt-0.5">{action.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-3">
                  <div className="flex items-center justify-between w-full text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <span className="i-ph:check-circle text-emerald-400" />
                      Project created successfully
                    </span>
                    <Button variant="link" size="sm" className="text-emerald-400 p-0 h-auto">
                      View all options
                      <span className="i-ph:arrow-right ml-1" />
                    </Button>
                  </div>
                </CardFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  },
);

WhatsNextCard.displayName = 'WhatsNextCard';
