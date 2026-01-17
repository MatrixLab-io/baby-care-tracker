// Bangladesh EPI Vaccine Schedule
export const BD_EPI_SCHEDULE = [
  {
    key: "bcg",
    day: 0,
    label: "BCG + OPV 0",
    shortLabel: "BCG",
    ageLabel: "At Birth"
  },
  {
    key: "penta1",
    day: 42,
    label: "Pentavalent 1 + OPV 1 + PCV 1",
    shortLabel: "Penta 1",
    ageLabel: "6 weeks"
  },
  {
    key: "penta2",
    day: 70,
    label: "Pentavalent 2 + OPV 2 + PCV 2",
    shortLabel: "Penta 2",
    ageLabel: "10 weeks"
  },
  {
    key: "penta3",
    day: 98,
    label: "Pentavalent 3 + OPV 3 + PCV 3",
    shortLabel: "Penta 3",
    ageLabel: "14 weeks"
  },
  {
    key: "mr1",
    day: 270,
    label: "MR (Measles-Rubella)",
    shortLabel: "MR 1",
    ageLabel: "9 months"
  },
  {
    key: "mr2",
    day: 450,
    label: "MR 2",
    shortLabel: "MR 2",
    ageLabel: "15 months"
  }
];

// Vaccine status types
export const VACCINE_STATUS = {
  COMPLETED: 'completed',
  DUE: 'due',
  UPCOMING: 'upcoming',
  OVERDUE: 'overdue'
};

// Status colors
export const STATUS_COLORS = {
  [VACCINE_STATUS.COMPLETED]: 'text-green-600 bg-green-50',
  [VACCINE_STATUS.DUE]: 'text-orange-600 bg-orange-50',
  [VACCINE_STATUS.UPCOMING]: 'text-blue-600 bg-blue-50',
  [VACCINE_STATUS.OVERDUE]: 'text-red-600 bg-red-50'
};

// Status icons
export const STATUS_ICONS = {
  [VACCINE_STATUS.COMPLETED]: '✅',
  [VACCINE_STATUS.DUE]: '⏳',
  [VACCINE_STATUS.UPCOMING]: '🔵',
  [VACCINE_STATUS.OVERDUE]: '⚠️'
};
