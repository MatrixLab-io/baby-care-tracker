import { BD_EPI_SCHEDULE, VACCINE_STATUS } from '../config/vaccines';
import { PRIVATE_VACCINE_SCHEDULE } from '../config/privateVaccines';
import { calculateAge, getDaysUntilVaccine, calculateVaccineDueDate } from './ageCalculator';

/**
 * Get vaccine status and details for a baby
 * @param {string} dob - Date of birth
 * @param {Object} completedVaccines - Vaccine keys mapped to `true` (given),
 *   `'skipped'` (opted out of), or absent/false (still outstanding). The string
 *   is additive, so records written before skipping existed still read correctly.
 * @param {Array} schedule - Vaccine schedule to use (defaults to BD_EPI_SCHEDULE)
 * @returns {Array} Array of vaccine objects with status
 */
export const getVaccineStatus = (dob, completedVaccines = {}, schedule = BD_EPI_SCHEDULE) => {
  if (!dob) return [];

  const age = calculateAge(dob);
  if (!age) return [];

  const currentDays = age.totalDays;

  return schedule.map(vaccine => {
    const record = completedVaccines[vaccine.key];
    const isCompleted = record === true;
    const isSkipped = record === VACCINE_STATUS.SKIPPED;
    const daysUntil = getDaysUntilVaccine(dob, vaccine.day);
    const dueDate = calculateVaccineDueDate(dob, vaccine.day);

    let status;
    let statusMessage;

    if (isCompleted) {
      status = VACCINE_STATUS.COMPLETED;
      statusMessage = 'Completed';
    } else if (isSkipped) {
      status = VACCINE_STATUS.SKIPPED;
      statusMessage = 'Skipped';
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
      isSkipped,
      isPast: currentDays >= vaccine.day
    };
  });
};

/**
 * Get progress summary
 */
export const getVaccineProgress = (vaccines) => {
  // A skipped dose is resolved, not outstanding, so it leaves the denominator
  // entirely — otherwise opting out would permanently cap progress below 100%.
  const skipped = vaccines.filter(v => v.isSkipped).length;
  const total = vaccines.length - skipped;
  const completed = vaccines.filter(v => v.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    skipped,
    remaining: total - completed,
    percentage
  };
};

/**
 * Get next upcoming vaccine
 */
export const getNextVaccine = (vaccines) => {
  const upcoming = vaccines
    .filter(v => !v.isCompleted && !v.isSkipped && v.status !== VACCINE_STATUS.OVERDUE)
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

/**
 * Get private vaccine status for a baby
 */
export const getPrivateVaccineStatus = (dob, completedVaccines = {}) => {
  // The private schedule is recommendation rather than programme, so every
  // dose on it can be opted out of. EPI doses cannot.
  return getVaccineStatus(dob, completedVaccines, PRIVATE_VACCINE_SCHEDULE)
    .map(vaccine => ({ ...vaccine, optional: true }));
};

/**
 * Get combined progress for both EPI and private vaccines
 */
export const getCombinedProgress = (epiVaccines, privateVaccines) => {
  const epi = getVaccineProgress(epiVaccines);
  const pvt = getVaccineProgress(privateVaccines);

  const total = epi.total + pvt.total;
  const completed = epi.completed + pvt.completed;
  const skipped = epi.skipped + pvt.skipped;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, skipped, remaining: total - completed, percentage };
};
