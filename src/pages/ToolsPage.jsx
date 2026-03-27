import { useTranslation } from 'react-i18next';
import { WrenchScrewdriverIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import { ToolCard } from '../../components/AppCard';
import ExpandableImage from '../../components/ExpandableImage';
import { tools, settings, games } from '../../data/tools';

export default function ToolsPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageSection id="tools" title={t('tools.title')} subtitle={t('tools.subtitle')}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {tools.map(t => <ToolCard key={t.name} tool={t} />)}
        </div>
        <h3 className="font-semibold text-sm text-primary mb-2">{t('tools.gamesTitle')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {games.map(g => (
            <div key={g.name} className="card bg-base-200 p-4">
              <h4 className="text-sm font-semibold">{g.name}</h4>
              <p className="text-xs text-base-content/50 leading-relaxed">{g.description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="settings" title={t('tools.settingsTitle')} icon={Cog6ToothIcon}>
        <ExpandableImage src="/screenshots/app-manager.webp" alt="App Manager — show/hide apps and configure autostart" className="mb-3" />
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
