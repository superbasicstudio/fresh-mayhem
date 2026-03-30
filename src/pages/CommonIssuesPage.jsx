import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageSection from '../../components/PageSection';
import { TbDeviceSdCard, TbDeviceDesktop, TbUsb, TbAntenna, TbChevronDown } from 'react-icons/tb';

const commonIssueCategories = [
  {
    id: 'sdCard',
    icon: TbDeviceSdCard,
    items: [
      { id: 'stuckBoot' },
      { id: 'noMedia' },
      { id: 'temperamental' },
      { id: 'corrupted' },
      { id: 'overSize' },
    ]
  },
  {
    id: 'boot',
    icon: TbDeviceDesktop,
    items: [
      { id: 'splashHang' },
      { id: 'bootLoop' },
      { id: 'blackScreen' },
    ]
  },
  {
    id: 'connection',
    icon: TbUsb,
    items: [
      { id: 'notRecognized' },
      { id: 'chargeOnly' },
      { id: 'sdOverUsb' },
    ]
  },
  {
    id: 'reception',
    icon: TbAntenna,
    items: [
      { id: 'noSignal' },
      { id: 'weakSignal' },
      { id: 'noAudio' },
    ]
  },
];

function IssueCategory({ category, t }) {
  const [open, setOpen] = useState(false);
  const Icon = category.icon;
  return (
    <div className="card bg-base-200/60 border border-base-300">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 w-full p-4 text-left hover:bg-base-300/30 transition-colors rounded-xl"
      >
        <Icon className="w-5 h-5 text-primary shrink-0" />
        <span className="text-sm font-semibold text-base-content/90 flex-1">
          {t(`commonIssues.categories.${category.id}.title`)}
        </span>
        <span className="text-[10px] font-mono text-base-content/40 mr-1">{category.items.length}</span>
        <TbChevronDown className={`w-4 h-4 text-base-content/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {category.items.map(item => (
            <div key={item.id} className="card bg-base-300/50 p-3">
              <h4 className="text-sm font-semibold text-base-content/80 mb-1">
                {t(`commonIssues.categories.${category.id}.items.${item.id}.problem`)}
              </h4>
              <p className="text-xs text-base-content/50 leading-relaxed">
                {t(`commonIssues.categories.${category.id}.items.${item.id}.fix`)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TroubleshootingPage() {
  const { t } = useTranslation();

  return (
    <PageSection id="troubleshooting" title={t('commonIssues.title')} subtitle={t('commonIssues.subtitle')}>
      <div className="space-y-3">
        {commonIssueCategories.map(cat => (
          <IssueCategory key={cat.id} category={cat} t={t} />
        ))}
      </div>
      <p className="text-[10px] text-base-content/30 mt-4">
        {t('commonIssues.footer')}
      </p>
    </PageSection>
  );
}
