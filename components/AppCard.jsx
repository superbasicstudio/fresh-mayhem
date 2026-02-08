import SafetyBadge from './SafetyBadge';
import ExpandableImage from './ExpandableImage';
import { SignalIcon, ExclamationTriangleIcon, WrenchIcon } from '@heroicons/react/16/solid';

export function RxAppCard({ app }) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base font-semibold text-success gap-1.5">
            <SignalIcon className="w-4 h-4 text-base-content/40 shrink-0" />
            {app.name}
          </h3>
          <SafetyBadge level="safe" />
        </div>
        <p className="text-sm text-base-content/60 leading-relaxed">{app.description}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="badge badge-ghost badge-sm font-mono text-[10px]">{app.frequency}</span>
          {app.wiki && (
            <a href={app.wiki} target="_blank" rel="noopener noreferrer" className="link link-primary text-xs font-medium" aria-label={`${app.name} wiki (opens in new tab)`}>Wiki</a>
          )}
        </div>
        {app.screenshot && (
          <ExpandableImage
            src={`/screenshots/${app.screenshot}`}
            alt={`${app.name} — live RF capture`}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}

const DANGER_DOT_COLORS = {
  extreme: '#dc2626',
  danger: '#ef4444',
  illegal: '#f97316',
  caution: '#eab308',
};

export function TxAppCard({ app }) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base font-semibold gap-1.5">
            <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-base-content/40" />
            {app.name}
          </h3>
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DANGER_DOT_COLORS[app.danger] || '#888' }} title={app.danger} />
        </div>
        <p className="text-sm text-base-content/60 leading-relaxed">{app.description}</p>
        <p className="text-xs text-base-content/40 mt-1 leading-relaxed">{app.legal}</p>
        {app.screenshot && (
          <ExpandableImage
            src={`/screenshots/${app.screenshot}`}
            alt={`${app.name} — interface mockup`}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}

export function ToolCard({ tool }) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold gap-1.5 flex items-center">
            <WrenchIcon className="w-4 h-4 text-base-content/40 shrink-0" />
            {tool.name}
          </h3>
          {tool.tx ? <SafetyBadge level="caution" /> : <span className="badge badge-ghost badge-sm font-mono text-[10px]">Utility</span>}
        </div>
        <p className="text-sm text-base-content/60 leading-relaxed">{tool.description}</p>
      </div>
    </div>
  );
}
