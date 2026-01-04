import { Card, CardContent } from '~/components/ui/shadcn';

export type GenerationSummary = {
  title: string;
  designSystem: {
    colors: string;
    typography: string;
    animations: string;
  };
  sections: string[];
};

export function GenerationSummaryCard({ summary }: { summary: GenerationSummary }) {
  return (
    <Card className="border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="text-sm text-bolt-elements-textSecondary uppercase tracking-wide">Generating</div>
        <div className="text-base text-bolt-elements-textPrimary font-semibold">{summary.title}</div>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-bolt-elements-textPrimary">Design System</div>
          <div className="text-sm text-bolt-elements-textSecondary space-y-1">
            <div>Colors: {summary.designSystem.colors}</div>
            <div>Typography: {summary.designSystem.typography}</div>
            <div>Animations: {summary.designSystem.animations}</div>
          </div>
        </div>

        {summary.sections.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-bolt-elements-textPrimary">Sections</div>
            <ol className="text-sm text-bolt-elements-textSecondary list-decimal list-inside space-y-1">
              {summary.sections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
