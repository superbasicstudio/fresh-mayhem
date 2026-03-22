import SafetyBadge from './SafetyBadge';
import ExpandableImage from './ExpandableImage';
import { SignalIcon, ExclamationTriangleIcon, WrenchIcon } from '@heroicons/react/16/solid';
import {
  SignalIcon as SignalOutline,
  CalculatorIcon,
  LockClosedIcon,
  FolderIcon,
  BoltIcon,
  ClipboardDocumentListIcon,
  ScissorsIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  QueueListIcon,
  KeyIcon,
  CircleStackIcon,
  ClockIcon,
  AdjustmentsVerticalIcon,
  MapIcon,
  SpeakerWaveIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';

const TOOL_ICONS = {
  'Antenna Length': SignalOutline,
  'Calculator': CalculatorIcon,
  'Cart Lock': LockClosedIcon,
  'File Manager': FolderIcon,
  'Flash Utility': BoltIcon,
  'Freq Manager': ClipboardDocumentListIcon,
  'IQ Trim': ScissorsIcon,
  'Metronome': MusicalNoteIcon,
  'Notepad': DocumentTextIcon,
  'Playlist Editor': QueueListIcon,
  'Random Password': KeyIcon,
  'SD over USB': CircleStackIcon,
  'Signal Generator': SignalOutline,
  'Stopwatch': ClockIcon,
  'Tuner': AdjustmentsVerticalIcon,
  'WardriveMap': MapIcon,
  'WAV Viewer': SpeakerWaveIcon,
  'Wipe SD Card': TrashIcon,
};

export function RxAppCard({ app }) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-3 sm:p-4">
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
      <div className="card-body p-3 sm:p-4">
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
  const Icon = TOOL_ICONS[tool.name] || WrenchIcon;
  return (
    <div className="card bg-base-200">
      <div className="card-body p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold gap-1.5 flex items-center">
            <Icon className="w-4 h-4 text-base-content/40 shrink-0" />
            {tool.name}
          </h3>
          {tool.tx ? <SafetyBadge level="caution" /> : <span className="badge badge-ghost badge-sm font-mono text-[10px]">Utility</span>}
        </div>
        <p className="text-sm text-base-content/60 leading-relaxed">{tool.description}</p>
        {tool.wiki && (
          <div className="mt-1.5">
            <a href={tool.wiki} target="_blank" rel="noopener noreferrer" className="link link-primary text-xs font-medium" aria-label={`${tool.name} wiki (opens in new tab)`}>Wiki</a>
          </div>
        )}
      </div>
    </div>
  );
}
