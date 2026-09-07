import { ArrowPathIcon, ArrowUturnLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { STATUS_ICONS, STATUS_TONES, VACCINE_STATUS } from '../config/vaccines';
import Badge from './ui/Badge';
import Button from './ui/Button';

// Written out rather than composed, so Tailwind can see every class it emits.
const WELL_CLASSES = {
  [VACCINE_STATUS.COMPLETED]: 'bg-live-bg text-live-fg',
  [VACCINE_STATUS.DUE]: 'bg-new-bg text-new-fg',
  [VACCINE_STATUS.UPCOMING]: 'bg-soon-bg text-soon-fg',
  [VACCINE_STATUS.OVERDUE]: 'bg-danger-bg text-danger-fg',
};

const VaccineCard = ({ vaccine, onToggle, isLoading = false, readOnly = false }) => {
  const { label, dueDate, status, statusMessage, isCompleted, ageLabel, ageDays } = vaccine;
  const StatusIcon = STATUS_ICONS[status];

  return (
    <div className={`p-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 ${isLoading ? 'opacity-60' : ''}`}>
      <span className={`icon-tile w-10 h-10 shrink-0 ${WELL_CLASSES[status]}`}>
        <StatusIcon className="w-5 h-5" aria-hidden="true" />
      </span>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-ink">{label}</h3>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Badge tone="accent">{ageLabel}</Badge>
          <Badge tone="neutral">{ageDays}</Badge>
          <Badge tone={STATUS_TONES[status]}>{statusMessage}</Badge>
        </div>

        <p className="text-[13px] text-ink-2 mt-2">
          Due <span className="font-medium text-ink">{dueDate}</span>
        </p>
      </div>

      {!readOnly && (
        <div className="shrink-0">
          <Button
            variant={isCompleted ? 'secondary' : 'accent'}
            size="sm"
            icon={isLoading ? ArrowPathIcon : isCompleted ? ArrowUturnLeftIcon : CheckIcon}
            loading={isLoading}
            onClick={() => onToggle(vaccine.key)}
          >
            {isLoading ? 'Updating' : isCompleted ? 'Undo' : 'Mark done'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VaccineCard;
