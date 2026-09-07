import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';

// Bangladesh EPI Vaccine Schedule
// Note: Bangladesh EPI uses day 45 for first dose (6 weeks), with 28-day intervals for subsequent doses
export const BD_EPI_SCHEDULE = [
  {
    key: "bcg",
    day: 0,
    label: "BCG + OPV 0",
    shortLabel: "BCG",
    ageLabel: "At Birth",
    ageDays: "Day 0"
  },
  {
    key: "penta1",
    day: 45,
    label: "Pentavalent 1 + OPV 1 + PCV 1",
    shortLabel: "Penta 1",
    ageLabel: "6 weeks",
    ageDays: "45 days"
  },
  {
    key: "penta2",
    day: 73,
    label: "Pentavalent 2 + OPV 2 + PCV 2",
    shortLabel: "Penta 2",
    ageLabel: "10 weeks",
    ageDays: "73 days"
  },
  {
    key: "penta3",
    day: 101,
    label: "Pentavalent 3 + OPV 3 + PCV 3",
    shortLabel: "Penta 3",
    ageLabel: "14 weeks",
    ageDays: "101 days"
  },
  {
    key: "mr1",
    day: 270,
    label: "MR (Measles-Rubella)",
    shortLabel: "MR 1",
    ageLabel: "9 months",
    ageDays: "270 days"
  },
  {
    key: "mr2",
    day: 450,
    label: "MR 2",
    shortLabel: "MR 2",
    ageLabel: "15 months",
    ageDays: "450 days"
  }
];

// Vaccine status types
export const VACCINE_STATUS = {
  COMPLETED: 'completed',
  DUE: 'due',
  UPCOMING: 'upcoming',
  OVERDUE: 'overdue',
  // Chosen not to give. Only offered on the private schedule — several of
  // those doses are alternatives to each other (RotaTeq is three doses,
  // Rotarix is two), so a parent legitimately opts out of some.
  SKIPPED: 'skipped'
};

// Status presentation. Tones map onto the design system's badge classes, so a
// status never invents a colour of its own.
export const STATUS_TONES = {
  [VACCINE_STATUS.COMPLETED]: 'live',
  [VACCINE_STATUS.DUE]: 'new',
  [VACCINE_STATUS.UPCOMING]: 'soon',
  [VACCINE_STATUS.OVERDUE]: 'danger',
  [VACCINE_STATUS.SKIPPED]: 'skip'
};

// Heroicons outline, never emoji.
export const STATUS_ICONS = {
  [VACCINE_STATUS.COMPLETED]: CheckCircleIcon,
  [VACCINE_STATUS.DUE]: ClockIcon,
  [VACCINE_STATUS.UPCOMING]: CalendarDaysIcon,
  [VACCINE_STATUS.OVERDUE]: ExclamationTriangleIcon,
  [VACCINE_STATUS.SKIPPED]: MinusCircleIcon
};
