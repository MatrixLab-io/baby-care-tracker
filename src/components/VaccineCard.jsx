import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { STATUS_COLORS, STATUS_ICONS } from '../config/vaccines';
import Button from './Button';

const VaccineCard = ({ vaccine, onToggle }) => {
  const { label, dueDate, status, statusMessage, isCompleted } = vaccine;

  return (
    <div className={`glass-card border-l-4 p-5 rounded-r-2xl transition-all hover:scale-[1.01] ${
      isCompleted ? 'border-green-500' : 'border-indigo-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{STATUS_ICONS[status]}</span>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{label}</h3>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Due Date:</span> {dueDate}
            </p>
            <p className={`text-sm font-medium inline-block px-3 py-1.5 rounded-lg ${STATUS_COLORS[status]}`}>
              {statusMessage}
            </p>
          </div>
        </div>

        <div>
          {isCompleted ? (
            <Button
              size="sm"
              variant="secondary"
              icon={ClockIcon}
              onClick={() => onToggle(vaccine.key)}
            >
              Undo
            </Button>
          ) : (
            <Button
              size="sm"
              variant="success"
              icon={CheckCircleIcon}
              onClick={() => onToggle(vaccine.key)}
            >
              Mark Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccineCard;
