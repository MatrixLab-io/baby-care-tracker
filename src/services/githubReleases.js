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

/**
 * Changelog categories. The badge follows the "## …" heading the item sits
 * under, so whoever writes the notes controls it: "## Fixes", "## New",
 * "## Improvements". Wording that plainly describes a repair wins over the
 * section, since fixes often get filed under a general "What's New".
 */
const SECTIONS = [
  { test: /fix|bug|patch/i, label: 'Fix', tone: 'new' },
  { test: /new|feature|add/i, label: 'New', tone: 'live' },
  { test: /improve|updat|change|enhanc/i, label: 'Update', tone: 'soon' },
];
const FIX_WORDING = /\bno longer\b|\bfixed?\b|\bwas broken\b|\bstopped\b|\binstead of failing\b/i;
const UPDATE = { label: 'Update', tone: 'soon' };

const sectionCategory = (heading) => SECTIONS.find((c) => c.test.test(heading)) || UPDATE;

const categorise = (heading, section) =>
  FIX_WORDING.test(heading) ? SECTIONS[0] : section;

/** First sentence of a paragraph, so a summary line stays one line. */
const firstSentence = (text) => {
  const [sentence] = text.split(/(?<=\.)\s/);
  return sentence.length > 110 ? `${sentence.slice(0, 107).trimEnd()}…` : sentence;
};

/**
 * One line per change, for the What's New dialog. The "###" sub-headings are
 * already written as short human-readable summaries, so they become the lines.
 * Notes without them fall back to their bullets, then to the opening sentence —
 * never to the "##" heading itself, which is too generic to be a summary.
 * Full detail lives on the changelog page.
 */
export const summariseRelease = (body, limit = 4) => {
  if (!body) return [];

  const lines = [];
  let section = UPDATE;

  for (const raw of body.split('\n')) {
    const line = raw.trim();

    if (line.startsWith('## ')) {
      section = sectionCategory(line.slice(3));
    } else if (line.startsWith('### ')) {
      lines.push({ ...categorise(line.slice(4), section), text: line.slice(4) });
    }
  }

  if (lines.length === 0) {
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (line.startsWith('## ')) {
        section = sectionCategory(line.slice(3));
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.slice(2);
        lines.push({ ...categorise(text, section), text });
      }
    }
  }

  if (lines.length === 0) {
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (line && !line.startsWith('#')) {
        lines.push({ ...categorise(line, section), text: firstSentence(line) });
        break;
      }
    }
  }

  return lines.slice(0, limit);
};
