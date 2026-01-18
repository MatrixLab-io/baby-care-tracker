/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string input - removes potentially dangerous characters
 * @param {string} input - Raw input string
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input, maxLength = 100) => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove angle brackets to prevent HTML injection
};

/**
 * Validate and sanitize baby name
 * @param {string} name - Baby name input
 * @returns {{ isValid: boolean, value: string, error: string }}
 */
export const validateBabyName = (name) => {
  const sanitized = sanitizeString(name, 50);

  if (!sanitized) {
    return { isValid: false, value: '', error: 'Name is required' };
  }

  if (sanitized.length < 2) {
    return { isValid: false, value: sanitized, error: 'Name must be at least 2 characters' };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\u0980-\u09FF\s'-]+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, value: sanitized, error: 'Name contains invalid characters' };
  }

  return { isValid: true, value: sanitized, error: '' };
};

/**
 * Validate date of birth
 * @param {string} dob - Date string in YYYY-MM-DD format
 * @returns {{ isValid: boolean, value: string, error: string }}
 */
export const validateDob = (dob) => {
  if (!dob) {
    return { isValid: false, value: '', error: 'Date of birth is required' };
  }

  // Check format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dob)) {
    return { isValid: false, value: dob, error: 'Invalid date format' };
  }

  const date = new Date(dob);
  const today = new Date();

  // Check if valid date
  if (isNaN(date.getTime())) {
    return { isValid: false, value: dob, error: 'Invalid date' };
  }

  // Check if not in future
  if (date > today) {
    return { isValid: false, value: dob, error: 'Date cannot be in the future' };
  }

  // Check reasonable range (not more than 5 years ago for a baby tracker)
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  if (date < fiveYearsAgo) {
    return { isValid: false, value: dob, error: 'Date seems too far in the past' };
  }

  return { isValid: true, value: dob, error: '' };
};

/**
 * Validate email address
 * @param {string} email - Email input
 * @returns {{ isValid: boolean, value: string, error: string }}
 */
export const validateEmail = (email) => {
  const sanitized = sanitizeString(email, 100);

  if (!sanitized) {
    return { isValid: false, value: '', error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, value: sanitized, error: 'Invalid email address' };
  }

  return { isValid: true, value: sanitized, error: '' };
};

/**
 * Validate URL
 * @param {string} url - URL input
 * @returns {{ isValid: boolean, value: string, error: string }}
 */
export const validateUrl = (url) => {
  if (!url) {
    return { isValid: true, value: '', error: '' }; // URL is optional
  }

  const sanitized = sanitizeString(url, 500);

  try {
    const urlObj = new URL(sanitized);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, value: sanitized, error: 'Only HTTP/HTTPS URLs are allowed' };
    }
    return { isValid: true, value: sanitized, error: '' };
  } catch {
    return { isValid: false, value: sanitized, error: 'Invalid URL' };
  }
};

/**
 * Validate base64 encoded data (for share URL vaccines param)
 * @param {string} data - Base64 encoded string
 * @returns {{ isValid: boolean, value: object, error: string }}
 */
export const validateBase64Json = (data) => {
  if (!data) {
    return { isValid: true, value: {}, error: '' };
  }

  try {
    // Check if it's valid base64
    const decoded = atob(data);
    const parsed = JSON.parse(decoded);

    // Ensure it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { isValid: false, value: {}, error: 'Invalid data format' };
    }

    return { isValid: true, value: parsed, error: '' };
  } catch {
    return { isValid: false, value: {}, error: 'Invalid encoded data' };
  }
};
