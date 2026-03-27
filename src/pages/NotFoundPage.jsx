import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import HackRFIcon from '../../components/HackRFIcon';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <HackRFIcon className="w-20 h-20 text-primary mx-auto mb-6 animate-signal-drift" />
        <h1 className="font-display text-3xl text-primary mb-2 tracking-wider">{t('notFound.code')}</h1>
        <h2 className="font-display text-sm text-base-content/60 mb-4 tracking-wider">{t('notFound.title')}</h2>
        <p className="text-sm text-base-content/40 mb-8 leading-relaxed">
          {t('notFound.message')}
        </p>
        <Link to="/" className="btn btn-sm btn-primary font-mono">
          {t('notFound.backButton')}
        </Link>
        <p className="text-[10px] text-base-content/20 mt-10 font-mono">{t('notFound.footer')}</p>
      </div>
    </div>
  );
}
