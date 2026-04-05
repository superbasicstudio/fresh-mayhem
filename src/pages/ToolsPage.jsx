import { useTranslation } from 'react-i18next';
import { WrenchScrewdriverIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import { ToolCard } from '../../components/AppCard';
import ExpandableCard from '../../components/ExpandableCard';
import ExpandableImage from '../../components/ExpandableImage';
import PortaPackMockup from '../../components/viz/PortaPackMockup';
import { tools, settings, games } from '../../data/tools';

export default function ToolsPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageSection id="tools" title={t('tools.title')} subtitle={t('tools.subtitle')}>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div className="space-y-3">
            <div className="card bg-base-200 p-4">
              <h3 className="font-semibold text-sm mb-2 text-primary">{t('tools.gamesTitle')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {games.map(g => (
                  <div key={g.name} className="bg-base-300/50 rounded-lg p-2.5">
                    <h4 className="text-xs font-semibold text-base-content/80">{g.name}</h4>
                    <p className="text-[11px] text-base-content/40 leading-relaxed">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ExpandableCard title="Games on Device" modalMaxWidth="max-w-7xl">
            {({ expanded }) => <PortaPackMockup expanded={expanded} initialMenu="games" />}
          </ExpandableCard>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map(t => <ToolCard key={t.name} tool={t} />)}
        </div>
      </PageSection>

      <PageSection id="settings" title={t('tools.settingsTitle')} icon={Cog6ToothIcon}>
        <ExpandableImage src="/screenshots/app-manager.webp" alt="App Manager  -  show/hide apps and configure autostart" className="mb-3 max-w-sm" />
        <div className="grid sm:grid-cols-2 gap-3">
          {settings.map(s => (
            <div key={s.name} className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="settings-accordion" aria-label={s.name} />
              <div className="collapse-title text-sm font-medium py-2 min-h-0">{s.name}</div>
              <div className="collapse-content"><p className="text-sm text-base-content/60 leading-relaxed">{s.description}</p></div>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
