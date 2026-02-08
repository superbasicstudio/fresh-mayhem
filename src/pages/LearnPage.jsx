import { useState } from 'react';
import { AcademicCapIcon, LinkIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import VideoEmbed from '../../components/VideoEmbed';
import { videos, resources } from '../../data/videos';
import { links, linkCategories } from '../../data/links';

const videoTabs = [
  { key: 'setup', label: 'Setup' },
  { key: 'firmware', label: 'Firmware' },
  { key: 'demos', label: 'App Demos' },
  { key: 'safety', label: 'Safety' },
  { key: 'course', label: 'SDR Course' },
];

export default function LearnPage() {
  const [videoTab, setVideoTab] = useState('setup');
  const [linkCategory, setLinkCategory] = useState(null);

  const filteredVideos = videos.filter(v => v.category === videoTab);

  return (
    <>
      <PageSection id="learn" title="Learn" icon={AcademicCapIcon}>
        <div className="flex gap-1 mb-4" role="tablist" aria-label="Learning content tabs">
          {videoTabs.map(({ key, label }) => (
            <button key={key} role="tab" aria-selected={videoTab === key}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${videoTab === key ? 'bg-base-300 text-base-content' : 'text-base-content/40 hover:text-base-content/70 hover:bg-base-300/50'}`}
              onClick={() => setVideoTab(key)}>{label}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-6" role="tabpanel" aria-label={`${videoTab} videos`}>
          {filteredVideos.map(v => <VideoEmbed key={v.url} video={v} />)}
        </div>

        <h3 className="font-semibold text-sm text-primary mb-2">Resources</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map(r => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="card bg-base-200 p-4 hover:bg-base-300 transition-colors">
              <h4 className="text-sm font-semibold link link-primary">{r.title}</h4>
              {r.description && <p className="text-xs text-base-content/50 mt-1 leading-relaxed">{r.description}</p>}
              <span className="badge badge-ghost badge-sm font-mono text-[10px] mt-1.5">{r.category}</span>
            </a>
          ))}
        </div>
      </PageSection>

      <PageSection id="links" title="Links & Resources" icon={LinkIcon}>
        <p className="text-sm text-base-content/50 mb-3 leading-relaxed">Curated links to Mayhem firmware, HackRF hardware, SDR learning resources, community tools, and legal references.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <button className={`badge ${!linkCategory ? 'badge-primary' : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`} onClick={() => setLinkCategory(null)}>All ({links.length})</button>
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
          {links.filter(l => !linkCategory || l.category === linkCategory).map(l => {
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
