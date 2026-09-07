import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Centred dialog on a dimmed backdrop. `dismissable` false keeps a destructive
 * confirmation from closing on a stray backdrop click.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  dismissable = true,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && dismissable) onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, dismissable, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="modal-backdrop" onClick={() => dismissable && onClose?.()} />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`modal-panel my-8 ${SIZES[size]} motion-enter`}
        >
          {title && (
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
              <div>
                <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
                {description && <p className="text-[13px] text-ink-2 mt-0.5">{description}</p>}
              </div>
              <button type="button" onClick={onClose} className="btn-icon -mr-2 -mt-1" aria-label="Close">
                <XMarkIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
