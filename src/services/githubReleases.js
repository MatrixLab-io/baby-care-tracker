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
 * Changelog categories. The badge follows the "## …" heading an item sits
 * under, so whoever writes the notes controls it: "## Fixes", "## New",
 * "## Improvements". Wording that plainly describes a repair wins over the
 * section, since fixes often get filed under a general "What's New".
 */
const SECTIONS = [
  { test: /fix|bug|patch/i, label: 'Fix', tone: 'new' },
  { test: /new|feature|add/i, label: 'New', tone: 'live' },
  { test: /improve|updat|change|enhanc/i, label: 'Update', tone: 'soon' },
];
const FIX_WORDING = /\bno longer\b|\bfixed?\b|\bwas broken\b|\bstopped\b/i;
const UPDATE = { label: 'Update', tone: 'soon' };

const sectionCategory = (heading) => SECTIONS.find((c) => c.test.test(heading)) || UPDATE;
const categorise = (heading, section) => (FIX_WORDING.test(heading) ? SECTIONS[0] : section);

/**
 * Enough Markdown for GitHub release notes: bullet lists and paragraphs.
 * Headings are consumed by the section split above this, not returned here.
 */
const parseBlocks = (lines) => {
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: [...listItems] });
      listItems = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
    } else {
      flushList();
      blocks.push({ type: 'p', text: line });
    }
  }
  flushList();

  return blocks;
};

/**
 * Release notes as a list of changes: a badge, a heading, and the body under
 * it. Both the What's New dialog and the changelog render from this, so they
 * stay structurally identical — the dialog trims each body, the changelog
 * shows all of it.
 */
export const parseReleaseSections = (body) => {
  if (!body) return [];

  const sections = [];
  let section = UPDATE;
  let current = null;

  const close = () => {
    if (current) {
      current.blocks = parseBlocks(current.lines);
      delete current.lines;
      sections.push(current);
      current = null;
    }
  };

  for (const raw of body.split('\n')) {
    const line = raw.trim();

    if (line.startsWith('## ')) {
      close();
      section = sectionCategory(line.slice(3));
    } else if (line.startsWith('### ')) {
      close();
      const heading = line.slice(4);
      current = { ...categorise(heading, section), heading, lines: [] };
    } else if (current) {
      current.lines.push(raw);
    } else if (line && !line.startsWith('#')) {
      // Notes written without sub-headings still have something to say.
      current = { ...section, heading: null, lines: [raw] };
    }
  }
  close();

  return sections;
};

/**
 * Trim to the first sentence where that fits, and to a word boundary
 * otherwise. Cutting at a fixed character count lands mid-phrase and reads as
 * though the text were damaged.
 */
const shorten = (text, maxChars) => {
  if (text.length <= maxChars) return text;

  const [sentence] = text.split(/(?<=[.!?])\s+/);
  if (sentence.length <= maxChars) return sentence;

  const cut = text.slice(0, maxChars);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/, '')}…`;
};

/**
 * A change's body as bullet points, in document order. Notes mix paragraphs
 * and lists freely; both read as bullets here, so every change is scanned the
 * same way rather than some being prose and some being lists.
 */
export const sectionBullets = (section, { limit, maxChars } = {}) => {
  const bullets = [];

  for (const block of section.blocks) {
    if (block.type === 'list') {
      bullets.push(...block.items);
    } else if (block.text) {
      bullets.push(block.text);
    }
  }

  const trimmed = maxChars ? bullets.map((b) => shorten(b, maxChars)) : bullets;

  return limit ? trimmed.slice(0, limit) : trimmed;
};
