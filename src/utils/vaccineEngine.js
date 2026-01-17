import { BD_EPI_SCHEDULE, VACCINE_STATUS } from '../config/vaccines';
import { calculateAge, getDaysUntilVaccine, calculateVaccineDueDate } from './ageCalculator';

/**
 * Get vaccine status and details for a baby
 * @param {string} dob - Date of birth
 * @param {Object} completedVaccines - Object with vaccine keys as true/false
 * @returns {Array} Array of vaccine objects with status
 */
export const getVaccineStatus = (dob, completedVaccines = {}) => {
  if (!dob) return [];

  const age = calculateAge(dob);
  if (!age) return [];

  const currentDays = age.totalDays;

  return BD_EPI_SCHEDULE.map(vaccine => {
    const isCompleted = completedVaccines[vaccine.key] === true;
    const daysUntil = getDaysUntilVaccine(dob, vaccine.day);
    const dueDate = calculateVaccineDueDate(dob, vaccine.day);

    let status;
    let statusMessage;

    if (isCompleted) {
      status = VACCINE_STATUS.COMPLETED;
      statusMessage = 'Completed';
    } else if (daysUntil < 0) {
      // Overdue
      status = VACCINE_STATUS.OVERDUE;
      const daysOverdue = Math.abs(daysUntil);
      statusMessage = `Overdue by ${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'}`;
    } else if (daysUntil === 0) {
      // Due today
      status = VACCINE_STATUS.DUE;
      statusMessage = 'Due today';
    } else if (daysUntil <= 7) {
      // Due within a week
      status = VACCINE_STATUS.DUE;
      statusMessage = `Due in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`;
    } else {
      // Upcoming
      status = VACCINE_STATUS.UPCOMING;
      if (daysUntil <= 30) {
        statusMessage = `Due in ${daysUntil} days`;
      } else {
        const weeks = Math.floor(daysUntil / 7);
        statusMessage = `Due in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      }
    }

    return {
      ...vaccine,
      status,
      statusMessage,
      dueDate,
      daysUntil,
      isCompleted,
      isPast: currentDays >= vaccine.day
    };
  });
};

/**
 * Get progress summary
 */
export const getVaccineProgress = (vaccines) => {
  const total = vaccines.length;
  const completed = vaccines.filter(v => v.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    remaining: total - completed,
    percentage
  };
};

/**
 * Get next upcoming vaccine
 */
export const getNextVaccine = (vaccines) => {
  const upcoming = vaccines
    .filter(v => !v.isCompleted && v.status !== VACCINE_STATUS.OVERDUE)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return upcoming[0] || null;
};

/**
 * Get overdue vaccines
 */
export const getOverdueVaccines = (vaccines) => {
  return vaccines.filter(v => v.status === VACCINE_STATUS.OVERDUE);
};

/**
 * Get vaccination stage badge
 */
export const getVaccinationStage = (vaccines) => {
  const completed = vaccines.filter(v => v.isCompleted);

  if (completed.length === 0) {
    return 'Not started';
  }

  const lastCompleted = completed[completed.length - 1];
  return `Vaccinated up to ${lastCompleted.ageLabel}`;
};
