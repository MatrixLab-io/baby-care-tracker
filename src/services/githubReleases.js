const REPO = 'MatrixLab-io/baby-care-tracker';

/**
 * Published releases, newest first. Unauthenticated, so it is subject to
 * GitHub's per-IP rate limit; callers should treat failure as "no notes to
 * show" rather than an error worth interrupting anyone over.
 */
export const fetchReleases = async ({ perPage = 30 } = {}) => {
  const response = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=${perPage}`);

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

/** Release dates read as "Sep 8, 2026" wherever they appear. */
export const formatReleaseDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
