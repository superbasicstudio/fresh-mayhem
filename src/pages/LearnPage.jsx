import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkIcon } from '@heroicons/react/24/outline';
import { TbBook } from 'react-icons/tb';
import PageSection from '../../components/PageSection';
import VideoEmbed from '../../components/VideoEmbed';
import { videos, resources } from '../../data/videos';
import { links, linkCategories } from '../../data/links';
import { communities } from '../../data/communities';

const RESOURCE_LABELS = {
  official: 'Official',
  wiki: 'Wiki',
  community: 'Community',
  legal: 'Regulatory Reference',
};

export default function LearnPage() {
  const { t } = useTranslation();
  const [videoTab, setVideoTab] = useState('setup');

  const videoTabs = [
    { key: 'setup', label: t('learn.tabs.setup') },
    { key: 'firmware', label: t('learn.tabs.firmware') },
    { key: 'demos', label: t('learn.tabs.demos') },
    { key: 'safety', label: t('learn.tabs.safety') },
    { key: 'course', label: t('learn.tabs.course') },
    { key: 'communities', label: t('learn.tabs.communities') },
  ];
  const [linkCategory, setLinkCategory] = useState(null);

  // Shuffle helper (Fisher-Yates)
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Shuffle videos/resources/links on tab change so no creator is always first
  const filteredVideos = useMemo(() => shuffle(videos.filter(v => v.category === videoTab)), [videoTab]);
  const shuffledResources = useMemo(() => shuffle(resources), []);
  const shuffledCommunities = useMemo(() => shuffle(communities), []);
  const shuffledLinks = useMemo(() => shuffle(links), []);

  return (
    <>
      <PageSection id="learn" title={t('learn.title')}>
        <div className="flex gap-1.5 sm:gap-2 mb-6 mt-2 border-b border-base-content/10 pb-3 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none" role="tablist" aria-label="Learning content tabs">
          {videoTabs.map(({ key, label }) => {
            const isActive = videoTab === key;
            const isCommunities = key === 'communities';
            const activeClass = isCommunities
              ? 'bg-[#ff4500]/10 text-[#ff4500] border border-[#ff4500]/40'
              : 'bg-base-300 text-base-content border border-primary/50';
            return (
            <button key={key} role="tab" aria-selected={isActive}
              className={`px-2.5 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${isActive ? activeClass : 'text-base-content/40 hover:text-base-content/70 hover:bg-base-300/50 border border-transparent'}`}
              onClick={() => setVideoTab(key)}>{label}</button>
            );
          })}
        </div>

        {videoTab === 'communities' ? (
          <div role="tabpanel" aria-label="Communities">
            <p className="text-xs sm:text-sm text-base-content/50 mb-4 leading-relaxed">{t('learn.communitiesIntro')}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shuffledCommunities.map(c => (
                <a
                  key={c.name}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card bg-base-200 p-4 hover:bg-base-300 transition-colors border border-transparent hover:border-base-content/10"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-semibold link link-primary">{c.name}</h4>
                    <span className="text-[10px] font-mono text-base-content/30">{c.members} {t('learn.subscribers')}</span>
                  </div>
                  <p className="text-xs text-base-content/50 leading-relaxed mb-2">{c.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {c.tags.map(tag => (
                      <span key={tag} className="badge badge-ghost badge-sm font-mono text-[10px]">{tag}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3 mb-6" role="tabpanel" aria-label={`${videoTab} videos`}>
              {filteredVideos.map(v => <VideoEmbed key={v.url} video={v} />)}
            </div>

            <h3 className="font-semibold text-sm text-primary mb-2">{t('learn.resources')}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shuffledResources.map(r => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="card bg-base-200 p-4 hover:bg-base-300 transition-colors">
                  <h4 className="text-sm font-semibold link link-primary">{r.title}</h4>
                  {r.description && <p className="text-xs text-base-content/50 mt-1 leading-relaxed">{r.description}</p>}
                  <span className="badge badge-ghost badge-sm font-mono text-[10px] mt-1.5">{RESOURCE_LABELS[r.category] || r.category}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </PageSection>

      <PageSection id="links" title={t('learn.linksTitle')}>
        <p className="text-sm text-base-content/50 mb-3 leading-relaxed">{t('learn.linksSubtitle')}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <button className={`badge ${!linkCategory ? 'badge-primary' : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`} onClick={() => setLinkCategory(null)}>{t('learn.all')} ({links.length})</button>
          {linkCategories.map(cat => {
            const count = links.filter(l => l.category === cat.id).length;
            return (
              <button key={cat.id} className={`badge ${linkCategory === cat.id ? cat.color : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`} onClick={() => setLinkCategory(linkCategory === cat.id ? null : cat.id)}>
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shuffledLinks.filter(l => !linkCategory || l.category === linkCategory).map(l => {
            const cat = linkCategories.find(c => c.id === l.category);
            return (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="card bg-base-200 p-4 hover:bg-base-300 transition-colors">
                <h4 className="text-sm font-semibold link link-primary">{l.title}</h4>
                {l.description && <p className="text-xs text-base-content/50 mt-1 leading-relaxed">{l.description}</p>}
                {cat && <span className={`badge ${cat.color} badge-sm font-mono text-[10px] mt-1.5`}>{cat.label}</span>}
              </a>
            );
          })}
        </div>
      </PageSection>
    </>
  );
}
