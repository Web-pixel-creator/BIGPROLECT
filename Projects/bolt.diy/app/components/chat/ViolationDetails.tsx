import { memo, useState } from 'react';
import type { UnifiedViolation } from '~/lib/services/sectionContracts';
import type { SanitizerWarning, ChangeMetrics } from '~/utils/codeSanitizer';
import { classNames } from '~/utils/classNames';

interface ViolationDetailsProps {
  violations?: UnifiedViolation[];
  sanitizerWarnings?: SanitizerWarning[];
  metrics?: ChangeMetrics;
  quarantinePath?: string;
  filePath?: string;
}

/**
 * Renders structured violation details for validation alerts.
 * Groups violations by severity and shows debug codes.
 */
export const ViolationDetails = memo(function ViolationDetails({
  violations,
  sanitizerWarnings,
  metrics,
  quarantinePath,
  filePath,
}: ViolationDetailsProps) {
  const [showRaw, setShowRaw] = useState(false);

  if (!violations?.length && !sanitizerWarnings?.length && !metrics) {
    return null;
  }

  const errors = violations?.filter((v) => v.severity === 'error') ?? [];
  const warnings = violations?.filter((v) => v.severity === 'warning') ?? [];

  return (
    <div className="mt-3 space-y-3">
      {/* File path */}
      {filePath && (
        <div className="text-xs text-bolt-elements-textTertiary">
          <span className="font-mono">{filePath}</span>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-red-400 flex items-center gap-1">
            <div className="i-ph:x-circle text-sm" />
            Errors ({errors.length})
          </div>
          <div className="space-y-1">
            {errors.map((v, i) => (
              <ViolationItem key={`error-${i}`} violation={v} />
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-yellow-400 flex items-center gap-1">
            <div className="i-ph:warning text-sm" />
            Warnings ({warnings.length})
          </div>
          <div className="space-y-1">
            {warnings.map((v, i) => (
              <ViolationItem key={`warning-${i}`} violation={v} />
            ))}
          </div>
        </div>
      )}

      {/* Sanitizer warnings */}
      {sanitizerWarnings && sanitizerWarnings.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-blue-400 flex items-center gap-1">
            <div className="i-ph:wrench text-sm" />
            Auto-fix attempted ({sanitizerWarnings.length})
          </div>
          <div className="space-y-1">
            {sanitizerWarnings.map((w, i) => (
              <div
                key={`sanitizer-${i}`}
                className="text-xs bg-bolt-elements-background-depth-3 rounded px-2 py-1"
              >
                <span className="font-mono text-blue-300 select-all">{w.code}</span>
                <span className="text-bolt-elements-textSecondary ml-2">{w.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk metrics */}
      {metrics && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-bolt-elements-textSecondary flex items-center gap-1">
            <div className="i-ph:chart-bar text-sm" />
            Risk Assessment
          </div>
          <div className="text-xs bg-bolt-elements-background-depth-3 rounded px-2 py-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <span className="text-bolt-elements-textTertiary">Risk Level:</span>
              <span className={classNames(
                'ml-1 font-medium',
                metrics.riskLevel === 'high' ? 'text-red-400' :
                metrics.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
              )}>
                {metrics.riskLevel}
              </span>
            </div>
            <div>
              <span className="text-bolt-elements-textTertiary">Changed:</span>
              <span className="ml-1 text-bolt-elements-textSecondary">
                {metrics.changedLinesPercent.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-bolt-elements-textTertiary">Added:</span>
              <span className="ml-1 text-green-400">+{metrics.charsAdded}</span>
            </div>
            <div>
              <span className="text-bolt-elements-textTertiary">Removed:</span>
              <span className="ml-1 text-red-400">-{metrics.charsRemoved}</span>
            </div>
            {metrics.highRiskFixes > 0 && (
              <div className="col-span-2">
                <span className="text-bolt-elements-textTertiary">High-risk fixes:</span>
                <span className="ml-1 text-red-400">{metrics.highRiskFixes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quarantine path */}
      {quarantinePath && (
        <div className="text-xs text-bolt-elements-textTertiary">
          <span className="i-ph:folder-lock mr-1" />
          Quarantined: <span className="font-mono select-all">{quarantinePath}</span>
        </div>
      )}

      {/* Toggle raw JSON */}
      <button
        onClick={() => setShowRaw(!showRaw)}
        className="text-xs text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary flex items-center gap-1"
      >
        <div className={showRaw ? 'i-ph:caret-up' : 'i-ph:caret-down'} />
        {showRaw ? 'Hide' : 'Show'} raw data
      </button>

      {showRaw && (
        <pre className="text-xs bg-bolt-elements-background-depth-3 rounded p-2 overflow-auto max-h-48 text-bolt-elements-textSecondary">
          {JSON.stringify({ violations, sanitizerWarnings, metrics, quarantinePath }, null, 2)}
        </pre>
      )}
    </div>
  );
});

/**
 * Single violation item with copyable code.
 */
function ViolationItem({ violation }: { violation: UnifiedViolation }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(violation.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const location = violation.context?.line
    ? `L${violation.context.line}${violation.context.column ? `:${violation.context.column}` : ''}`
    : null;

  return (
    <div className="text-xs bg-bolt-elements-background-depth-3 rounded px-2 py-1.5 flex items-start gap-2">
      <button
        onClick={copyCode}
        title="Copy code"
        className={classNames(
          'font-mono shrink-0 px-1 rounded transition-colors',
          violation.severity === 'error' ? 'text-red-300 hover:bg-red-900/30' : 'text-yellow-300 hover:bg-yellow-900/30',
          copied && 'bg-green-900/30 text-green-300'
        )}
      >
        {copied ? '✓' : violation.code}
      </button>
      <div className="flex-1 min-w-0">
        <span className="text-bolt-elements-textSecondary">{violation.message}</span>
        {location && (
          <span className="text-bolt-elements-textTertiary ml-2">({location})</span>
        )}
        {violation.autoFixable && (
          <span className="ml-2 text-green-400 text-[10px]">auto-fixable</span>
        )}
      </div>
    </div>
  );
}
