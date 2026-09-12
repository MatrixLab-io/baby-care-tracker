import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const TONES = {
  danger: { icon: ExclamationCircleIcon, role: 'alert' },
  caution: { icon: ExclamationTriangleIcon, role: 'note' },
  info: { icon: InformationCircleIcon, role: 'note' },
  success: { icon: CheckCircleIcon, role: 'status' },
};

/**
 * Shopify-style banner: a saturated header bar with the icon and title, over a
 * plain body. Without a title there is no bar to fill, so it falls back to the
 * compact tinted row — the right shape for a one-line field error.
 */
export default function Alert({ tone = 'info', title, icon, children, className = '' }) {
  const { icon: ToneIcon, role } = TONES[tone];
  const Icon = icon || ToneIcon;

  if (!title) {
    return (
      <div role={role} className={`banner banner-${tone} banner-compact ${className}`}>
        <Icon className="w-5 h-5 shrink-0 mt-px" aria-hidden="true" />
        <div className="text-sm leading-relaxed min-w-0">{children}</div>
      </div>
    );
  }

  return (
    <div role={role} className={`banner banner-${tone} ${className}`}>
      <div className="banner-bar">
        <Icon className="w-[18px] h-[18px] shrink-0 mt-px" aria-hidden="true" />
        <span className="min-w-0">{title}</span>
      </div>
      <div className="banner-content">{children}</div>
    </div>
  );
}
