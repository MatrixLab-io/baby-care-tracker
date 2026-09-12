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
 * Inline message block, Polaris banner shape: tinted field, status colour in
 * the border and icon, copy in ordinary ink. Status colour carries meaning,
 * never decoration.
 */
export default function Alert({ tone = 'info', title, icon, children, className = '' }) {
  const { icon: ToneIcon, role } = TONES[tone];
  const Icon = icon || ToneIcon;

  return (
    <div role={role} className={`banner banner-${tone} flex items-start gap-3 ${className}`}>
      <Icon className="banner-icon w-5 h-5 shrink-0 mt-px" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="banner-title mb-0.5">{title}</p>}
        <div className="banner-body">{children}</div>
      </div>
    </div>
  );
}
