import { useTranslation } from 'react-i18next';

const badgeConfig = {
  safe: { cls: 'fm-badge-safe' },
  caution: { cls: 'fm-badge-caution' },
  danger: { cls: 'fm-badge-danger' },
  extreme: { cls: 'fm-badge-extreme' },
  illegal: { cls: 'fm-badge-danger' },
};

export default function SafetyBadge({ level }) {
  const { t } = useTranslation();
  const config = badgeConfig[level] || badgeConfig.safe;

  const badges = {
    safe: { label: t('badges.rx'), title: t('badges.rxTooltip') },
    caution: { label: t('badges.caution'), title: t('badges.cautionTooltip') },
    danger: { label: t('badges.danger'), title: t('badges.dangerTooltip') },
    extreme: { label: t('badges.extreme'), title: t('badges.extremeTooltip') },
    illegal: { label: t('badges.illegal'), title: t('badges.illegalTooltip') },
  };

  const b = badges[level] || badges.safe;
  return <span className={`${config.cls} cursor-help`} title={b.title}>{b.label}</span>;
}
