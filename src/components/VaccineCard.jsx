import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  CheckIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';
import { STATUS_ICONS, STATUS_TONES, VACCINE_STATUS } from '../config/vaccines';
import Badge from './ui/Badge';
import Button from './ui/Button';

// Written out rather than composed, so Tailwind can see every class it emits.
const WELL_CLASSES = {
  [VACCINE_STATUS.COMPLETED]: 'bg-live-bg text-live-fg',
  [VACCINE_STATUS.DUE]: 'bg-new-bg text-new-fg',
  [VACCINE_STATUS.UPCOMING]: 'bg-soon-bg text-soon-fg',
  [VACCINE_STATUS.OVERDUE]: 'bg-danger-bg text-danger-fg',
  [VACCINE_STATUS.SKIPPED]: 'bg-skip-bg text-skip-fg',
};

const VaccineCard = ({ vaccine, onToggle, onSkip, isLoading = false, readOnly = false }) => {
  const { label, dueDate, status, statusMessage, isCompleted, isSkipped, optional, ageLabel, ageDays } =
    vaccine;
  const StatusIcon = STATUS_ICONS[status];

  // Skipping is offered only on the private schedule, and only while the dose
  // is still outstanding — a dose already given is undone, not skipped.
  const canSkip = Boolean(onSkip) && optional && !isCompleted;

  // Emphasis follows urgency: a dose due now or overdue gets the accent, a
  // dose years away is a quiet secondary action.
  const isActionable = status === VACCINE_STATUS.DUE || status === VACCINE_STATUS.OVERDUE;

  return (
    <div
      className={`p-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 ${
        isLoading ? 'opacity-60' : ''
      }`}
    >
      <span className={`icon-tile w-10 h-10 shrink-0 ${WELL_CLASSES[status]}`}>
        <StatusIcon className="w-5 h-5" aria-hidden="true" />
      </span>

      <div className="flex-1 min-w-0">
        <h3 className={`text-[15px] font-semibold ${isSkipped ? 'text-ink-2' : 'text-ink'}`}>{label}</h3>

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
        <div className="shrink-0 flex items-center gap-2">
          {isSkipped ? (
            <Button
              variant="secondary"
              size="sm"
              icon={isLoading ? ArrowPathIcon : ArrowUturnLeftIcon}
              loading={isLoading}
              onClick={() => onSkip(vaccine.key, 'pending')}
            >
              {isLoading ? 'Updating' : 'Un-skip'}
            </Button>
          ) : (
            <>
              {canSkip && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={MinusCircleIcon}
                  disabled={isLoading}
                  onClick={() => onSkip(vaccine.key, 'skipped')}
                  title="Not giving this dose"
                >
                  Skip
                </Button>
              )}
              <Button
                variant={!isCompleted && isActionable ? 'accent' : 'secondary'}
                size="sm"
                icon={isLoading ? ArrowPathIcon : isCompleted ? ArrowUturnLeftIcon : CheckIcon}
                loading={isLoading}
                onClick={() => onToggle(vaccine.key)}
              >
                {isLoading ? 'Updating' : isCompleted ? 'Undo' : 'Mark done'}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VaccineCard;
