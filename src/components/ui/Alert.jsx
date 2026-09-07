import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const TONES = {
  danger: { wrap: 'bg-danger-bg text-danger-fg', icon: ExclamationCircleIcon, role: 'alert' },
  caution: { wrap: 'bg-new-bg text-new-fg', icon: ExclamationTriangleIcon, role: 'note' },
  info: { wrap: 'bg-soon-bg text-soon-fg', icon: InformationCircleIcon, role: 'note' },
  success: { wrap: 'bg-live-bg text-live-fg', icon: CheckCircleIcon, role: 'status' },
};

/** Inline message block. Status colour carries the meaning, never decoration. */
export default function Alert({ tone = 'info', title, icon, children, className = '' }) {
  const { wrap, icon: ToneIcon, role } = TONES[tone];
  const Icon = icon || ToneIcon;

  return (
    <div role={role} className={`flex items-start gap-3 p-3.5 rounded-control ${wrap} ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-px" aria-hidden="true" />
      <div className="text-sm leading-relaxed min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        {children}
      </div>
    </div>
  );
}
