import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { rxApps } from '../data/rxApps';
import { txApps } from '../data/txApps';
import { tools, settings, games } from '../data/tools';
import { mistakes } from '../data/safety';
import { noGoBands, legalBands } from '../data/frequencyMap';
import { links } from '../data/links';
import { videos } from '../data/videos';
import {
  TbRadar, TbDeviceGamepad, TbAntenna, TbBroadcast, TbWaveSine, TbBook,
  TbSearch, TbArrowRight,
} from 'react-icons/tb';
import {
  WrenchScrewdriverIcon, ShieldExclamationIcon, RocketLaunchIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

/* ── search index ─────────────────────────────────────────── */

function buildIndex() {
  const items = [];

  // Pages
  const pages = [
    { path: '/', label: 'Overview', desc: 'Dashboard overview and quick stats', icon: 'page' },
    { path: '/controls', label: 'Controls', desc: 'PortaPack controls, gain chain, waterfall', icon: 'page' },
    { path: '/receive', label: 'Receive (RX) Apps', desc: 'All receive applications', icon: 'page' },
    { path: '/transmit', label: 'Transmit (TX) Apps', desc: 'All transmit applications with danger ratings', icon: 'page' },
    { path: '/tools', label: 'Tools', desc: 'Utilities, settings, and games', icon: 'page' },
    { path: '/safety', label: 'Safety Center', desc: 'Damage scenarios, stories, and warnings', icon: 'page' },
    { path: '/frequencies', label: 'Frequencies', desc: 'Frequency spectrum, no-go bands, legal bands', icon: 'page' },
    { path: '/learn', label: 'Videos / Learning', desc: 'Educational videos and resources', icon: 'page' },
    { path: '/quickstart', label: 'Quick Start', desc: 'Step-by-step setup guide', icon: 'page' },
  ];
  pages.forEach(p => items.push({
    id: `page-${p.path}`,
    type: 'page',
    title: p.label,
    description: p.desc,
    path: p.path,
    keywords: p.label.toLowerCase(),
  }));

  // RX Apps
  rxApps.forEach(app => items.push({
    id: `rx-${app.name}`,
    type: 'rx',
    title: app.name,
    description: app.description,
    path: '/receive',
    keywords: `${app.name} ${app.description} ${app.category || ''} ${app.frequency || ''} receive rx`.toLowerCase(),
  }));

  // TX Apps
  txApps.forEach(app => items.push({
    id: `tx-${app.name}`,
    type: 'tx',
    title: app.name,
    description: app.description,
    path: '/transmit',
    keywords: `${app.name} ${app.description} ${app.danger || ''} transmit tx`.toLowerCase(),
    danger: app.danger,
  }));

  // Tools
  tools.forEach(t => items.push({
    id: `tool-${t.name}`,
    type: 'tool',
    title: t.name,
    description: t.description,
    path: '/tools',
    keywords: `${t.name} ${t.description} tool utility`.toLowerCase(),
  }));

  // Settings
  settings.forEach(s => items.push({
    id: `setting-${s.name}`,
    type: 'setting',
    title: s.name,
    description: s.description,
    path: '/tools',
    keywords: `${s.name} ${s.description} setting config`.toLowerCase(),
  }));

  // Games
  games.forEach(g => items.push({
    id: `game-${g.name}`,
    type: 'game',
    title: g.name,
    description: g.description,
    path: '/tools',
    keywords: `${g.name} ${g.description} game`.toLowerCase(),
  }));

  // Safety / Mistakes
  mistakes.forEach(m => items.push({
    id: `safety-${m.title}`,
    type: 'safety',
    title: m.title,
    description: m.description,
    path: '/safety',
    keywords: `${m.title} ${m.description} safety damage ${m.severity || ''}`.toLowerCase(),
  }));

  // No-Go Bands
  noGoBands.forEach(b => items.push({
    id: `nogo-${b.name}`,
    type: 'frequency',
    title: `${b.name} (No-Go)`,
    description: `${b.service} — ${b.startMHz}–${b.endMHz} MHz`,
    path: '/frequencies',
    keywords: `${b.name} ${b.service} ${b.startMHz} ${b.endMHz} no-go prohibited frequency`.toLowerCase(),
  }));

  // Legal Bands
  legalBands.forEach(b => items.push({
    id: `legal-${b.name}`,
    type: 'frequency',
    title: `${b.name} (Legal)`,
    description: `${b.requirements} — ${b.startMHz}–${b.endMHz} MHz`,
    path: '/frequencies',
    keywords: `${b.name} ${b.requirements} ${b.startMHz} ${b.endMHz} legal allowed frequency`.toLowerCase(),
  }));

  // Videos
  videos.forEach(v => items.push({
    id: `video-${v.title}`,
    type: 'video',
    title: v.title,
    description: `by ${v.creator}`,
    path: '/learn',
    url: v.url,
    keywords: `${v.title} ${v.creator} ${v.category || ''} video learn`.toLowerCase(),
  }));

  // Links / Resources
  links.forEach(l => items.push({
    id: `link-${l.title}`,
    type: 'link',
    title: l.title,
    description: l.description,
    url: l.url,
    path: '/learn',
    keywords: `${l.title} ${l.description} ${l.category || ''} link resource`.toLowerCase(),
  }));

  return items;
}

/* ── type labels & colors ─────────────────────────────────── */

const typeMeta = {
  page:      { label: 'Page',      color: 'badge-primary' },
  rx:        { label: 'RX App',    color: 'badge-info' },
  tx:        { label: 'TX App',    color: 'badge-error' },
  tool:      { label: 'Tool',      color: 'badge-accent' },
  setting:   { label: 'Setting',   color: 'badge-ghost' },
  game:      { label: 'Game',      color: 'badge-warning' },
  safety:    { label: 'Safety',    color: 'badge-error' },
  frequency: { label: 'Frequency', color: 'badge-secondary' },
  video:     { label: 'Video',     color: 'badge-info' },
  link:      { label: 'Link',      color: 'badge-ghost' },
};

/* ── component ────────────────────────────────────────────── */

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Show pages when empty
      return index.filter(i => i.type === 'page');
    }
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = index
      .map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        for (const term of terms) {
          if (titleLower === term) score += 100;
          else if (titleLower.startsWith(term)) score += 60;
          else if (titleLower.includes(term)) score += 40;
          else if (item.keywords.includes(term)) score += 20;
          else return null; // all terms must match
        }
        // Boost pages
        if (item.type === 'page') score += 10;
        return { ...item, score };
      })
      .filter(Boolean);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 30);
  }, [query, index]);

  // Reset selection when results change
  useEffect(() => { setSelectedIndex(0); }, [results]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const select = useCallback((item) => {
    onClose();
    if (item.url && !item.path) {
      window.open(item.url, '_blank', 'noopener');
    } else {
      navigate(item.path);
    }
  }, [navigate, onClose]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      select(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [results, selectedIndex, select, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette */}
      <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
        <div
          className="bg-base-200 border border-primary/20 rounded-xl shadow-2xl shadow-primary/5 w-full max-w-lg pointer-events-auto overflow-hidden"
          role="dialog"
          aria-label="Search"
        >
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-base-content/10">
            <MagnifyingGlassIcon className="w-5 h-5 text-primary/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search apps, tools, frequencies, pages..."
              className="flex-1 bg-transparent text-sm text-base-content placeholder:text-base-content/30 outline-none font-body"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Search"
              autoComplete="off"
              spellCheck="false"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-base-300 text-[10px] text-base-content/40 font-mono border border-base-content/10">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <ul
            ref={listRef}
            className="max-h-[50vh] overflow-y-auto py-2"
            role="listbox"
          >
            {results.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-base-content/30 font-mono">
                No results for &ldquo;{query}&rdquo;
              </li>
            )}
            {results.map((item, i) => {
              const meta = typeMeta[item.type] || { label: item.type, color: 'badge-ghost' };
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={i === selectedIndex}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                    i === selectedIndex
                      ? 'bg-primary/10 text-base-content'
                      : 'text-base-content/70 hover:bg-base-300/60'
                  }`}
                  onClick={() => select(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      <span className={`badge badge-xs ${meta.color} font-mono text-[9px] shrink-0`}>
                        {meta.label}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-base-content/40 truncate mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <TbArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${i === selectedIndex ? 'opacity-60' : 'opacity-0'}`} />
                </li>
              );
            })}
          </ul>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-base-content/5 flex items-center gap-4 text-[10px] text-base-content/25 font-mono">
            <span><kbd className="px-1 py-0.5 rounded bg-base-300 border border-base-content/10">&uarr;&darr;</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-base-300 border border-base-content/10">&crarr;</kbd> select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-base-300 border border-base-content/10">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </>
  );
}
