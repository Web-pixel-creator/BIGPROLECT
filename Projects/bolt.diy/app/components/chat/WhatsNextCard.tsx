import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '~/components/ui/shadcn';

interface WhatsNextAction {
  icon: string;
  title: string;
  description: string;
  action?: () => void;
}

interface WhatsNextCardProps {
  title?: string;
  actions?: WhatsNextAction[];
  onCustomize?: () => void;
  onChatMode?: () => void;
}

const defaultActions: WhatsNextAction[] = [
  {
    icon: 'i-ph:paint-brush-duotone',
    title: 'Refine & Customize',
    description: 'Adjust colors, styles, and animations through prompts or visual edits',
  },
  {
    icon: 'i-ph:chat-circle-text-duotone',
    title: 'Master Prompting',
    description: 'Use "chat mode" to plan new sections and features',
  },
  {
    icon: 'i-ph:code-duotone',
    title: 'Explore Code',
    description: 'Open Workbench to view and edit the generated code',
  },
  {
    icon: 'i-ph:rocket-launch-duotone',
    title: 'Deploy',
    description: 'Deploy your project to Netlify or other platforms',
  },
];

export const WhatsNextCard = memo(({ title = "What's next?", actions = defaultActions }: WhatsNextCardProps) => {
  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="i-ph:sparkle-duotone text-xl text-emerald-400" />
          <CardTitle className="text-base text-emerald-300">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left group"
            >
              <div className={`${action.icon} text-xl text-emerald-400 group-hover:scale-110 transition-transform`} />
              <div>
                <h4 className="text-sm font-medium text-white/90">{action.title}</h4>
                <p className="text-xs text-white/50 mt-0.5">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

WhatsNextCard.displayName = 'WhatsNextCard';
