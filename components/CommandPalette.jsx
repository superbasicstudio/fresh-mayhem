import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { rxApps } from '../data/rxApps';
import { txApps } from '../data/txApps';
import { tools, settings, games } from '../data/tools';
import { mistakes } from '../data/safety';
import { noGoBands, legalBands } from '../data/frequencyMap';
import { links } from '../data/links';
import { videos } from '../data/videos';
import { vendors } from '../data/vendors';
import { communities } from '../data/communities';
import {
  TbRadar, TbDeviceGamepad, TbAntenna, TbBroadcast, TbWaveSine, TbBook,
  TbSearch, TbArrowRight,
} from 'react-icons/tb';
import {
  WrenchScrewdriverIcon, ShieldExclamationIcon, RocketLaunchIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

/* ── search index ─────────────────────────────────────────── */

function buildIndex(t) {
  const items = [];

  // Pages
  const pages = [
    { path: '/', label: t('nav.overview'), desc: t('search.pageDescriptions.overview'), icon: 'page' },
    { path: '/controls', label: t('nav.controls'), desc: t('search.pageDescriptions.controls'), icon: 'page' },
    { path: '/receive', label: t('nav.receive'), desc: t('search.pageDescriptions.receive'), icon: 'page' },
    { path: '/transmit', label: t('nav.transmit'), desc: t('search.pageDescriptions.transmit'), icon: 'page' },
    { path: '/tools', label: t('nav.tools'), desc: t('search.pageDescriptions.tools'), icon: 'page' },
    { path: '/safety', label: t('nav.safety'), desc: t('search.pageDescriptions.safety'), icon: 'page' },
    { path: '/frequencies', label: t('nav.frequencies'), desc: t('search.pageDescriptions.frequencies'), icon: 'page' },
    { path: '/learn', label: t('nav.learn'), desc: t('search.pageDescriptions.learn'), icon: 'page' },
    { path: '/quickstart', label: t('nav.quickstart'), desc: t('search.pageDescriptions.quickstart'), icon: 'page' },
    { path: '/where-to-buy', label: t('nav.whereToBuy'), desc: t('search.pageDescriptions.whereToBuy'), icon: 'page' },
  ];
  pages.forEach(p => items.push({
    id: `page-${p.path}`,
    type: 'page',
    title: p.label,
    description: p.desc,
    path: p.path,
    keywords: p.label.toLowerCase(),
  }));

  // Helper: get translated text with English fallback for keywords
  const td = (key, fallback) => { const v = t(key, { defaultValue: '' }); return v || fallback; };

  // RX Apps
  rxApps.forEach(app => {
    const desc = td(`data.rxApps.${app.name}.description`, app.description);
    items.push({
      id: `rx-${app.name}`, type: 'rx', title: app.name, description: desc, path: '/receive',
      keywords: `${app.name} ${app.description} ${desc} ${app.category || ''} ${app.frequency || ''} receive rx`.toLowerCase(),
    });
  });

  // TX Apps
  txApps.forEach(app => {
    const desc = td(`data.txApps.${app.name}.description`, app.description);
    items.push({
      id: `tx-${app.name}`, type: 'tx', title: app.name, description: desc, path: '/transmit',
      keywords: `${app.name} ${app.description} ${desc} ${app.danger || ''} transmit tx`.toLowerCase(),
      danger: app.danger,
    });
  });

  // Tools
  tools.forEach(tool => items.push({
    id: `tool-${tool.name}`, type: 'tool', title: tool.name, description: tool.description, path: '/tools',
    keywords: `${tool.name} ${tool.description} tool utility`.toLowerCase(),
  }));

  // Settings
  settings.forEach(s => items.push({
    id: `setting-${s.name}`, type: 'setting', title: s.name, description: s.description, path: '/tools',
    keywords: `${s.name} ${s.description} setting config`.toLowerCase(),
  }));

  // Games
  games.forEach(g => items.push({
    id: `game-${g.name}`, type: 'game', title: g.name, description: g.description, path: '/tools',
    keywords: `${g.name} ${g.description} game`.toLowerCase(),
  }));

  // Safety / Mistakes
  mistakes.forEach(m => {
    const desc = td(`data.safety.mistakes.${m.title}.description`, m.description);
    items.push({
      id: `safety-${m.title}`, type: 'safety', title: m.title, description: desc, path: '/safety',
      keywords: `${m.title} ${m.description} ${desc} safety damage ${m.severity || ''}`.toLowerCase(),
    });
  });

  // No-Go Bands
  noGoBands.forEach(b => items.push({
    id: `nogo-${b.name}`, type: 'frequency', title: `${b.name}`, description: `${b.service}  -  ${b.startMHz}-${b.endMHz} MHz`, path: '/frequencies',
    keywords: `${b.name} ${b.service} ${b.startMHz} ${b.endMHz} no-go restricted frequency`.toLowerCase(),
  }));

  // Legal Bands
  legalBands.forEach(b => items.push({
    id: `legal-${b.name}`, type: 'frequency', title: `${b.name}`, description: `${b.requirements}  -  ${b.startMHz}-${b.endMHz} MHz`, path: '/frequencies',
    keywords: `${b.name} ${b.requirements} ${b.startMHz} ${b.endMHz} ism frequency`.toLowerCase(),
  }));

  // Videos
  videos.forEach(v => items.push({
    id: `video-${v.title}`, type: 'video', title: v.title, description: `by ${v.creator}`, path: '/learn', url: v.url,
    keywords: `${v.title} ${v.creator} ${v.category || ''} video learn`.toLowerCase(),
  }));

  // Vendors
  vendors.forEach(v => {
    const desc = td(`data.vendors.${v.name}.description`, v.description);
    items.push({
      id: `vendor-${v.name}`, type: 'vendor', title: v.name, description: desc, path: '/where-to-buy',
      keywords: `${v.name} ${v.description} ${desc} ${v.products.join(' ')} ${v.category} vendor buy purchase shop hackrf portapack`.toLowerCase(),
    });
  });

  // Communities
  communities.forEach(c => {
    const desc = td(`data.communities.${c.name}.description`, c.description);
    items.push({
      id: `community-${c.name}`, type: 'community', title: c.name, description: desc, url: c.url, path: '/learn',
      keywords: `${c.name} ${c.description} ${desc} ${c.tags.join(' ')} community reddit subreddit forum`.toLowerCase(),
    });
  });

  // Links / Resources
  links.forEach(l => items.push({
    id: `link-${l.title}`, type: 'link', title: l.title, description: l.description, url: l.url, path: '/learn',
    keywords: `${l.title} ${l.description} ${l.category || ''} link resource`.toLowerCase(),
  }));

  return items;
}

/* ── type labels & colors ─────────────────────────────────── */

const typeColors = {
  page: 'badge-primary', rx: 'badge-info', tx: 'badge-error', tool: 'badge-accent',
  setting: 'badge-ghost', game: 'badge-warning', safety: 'badge-error',
  frequency: 'badge-secondary', video: 'badge-info', vendor: 'badge-accent',
  link: 'badge-ghost', community: 'badge-ghost',
};

/* ── component ────────────────────────────────────────────── */

export default function CommandPalette({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const typeMeta = useMemo(() => {
    const labels = {};
    Object.keys(typeColors).forEach(k => {
      labels[k] = { label: t(`search.types.${k}`, { defaultValue: k }), color: typeColors[k] };
    });
    return labels;
  }, [t, i18n.language]);

  const index = useMemo(() => buildIndex(t), [t, i18n.language]);

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
              placeholder={t('search.placeholder')}
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
                {t('search.noResults', { query })}
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
            <span><kbd className="px-1 py-0.5 rounded bg-base-300 border border-base-content/10">&uarr;&darr;</kbd> {t('search.navigate')}</span>
            <span><kbd className="px-1 py-0.5 rounded bg-base-300 border border-base-content/10">&crarr;</kbd> {t('search.select')}</span>
            <span><kbd className="px-1 py-0.5 rounded bg-base-300 border border-base-content/10">esc</kbd> {t('search.close')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
