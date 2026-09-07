/**
 * Renders public/og-image.png (1200x630) from the landing page's own language
 * and palette: the BrandMark, the "Every dose, on the day it is due." headline,
 * and the design system's paper/ink/teal tokens. Run: node scripts/generate-og-image.cjs
 */
const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 630;

// Straight from src/styles/tokens.css and BrandMark.jsx.
const GROUND = '#f1f1f1';
const SURFACE = '#ffffff';
const INK = '#303030';
const INK_2 = '#616161';
const LINE = '#e3e3e3';
const BRAND_TEAL = '#14b8a6';
const BRAND_CORAL = '#f4694f';
const ACCENT = '#0d9488';

const FONT = "'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/** The mark from src/components/BrandMark.jsx, scaled up. */
const brandMark = (x, y, size) => {
  const s = size / 32;
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect width="32" height="32" rx="8" fill="${BRAND_TEAL}"/>
    <g transform="translate(3 3) scale(0.8125)">
      <circle cx="13" cy="18.5" r="9" fill="#ffffff"/>
      <circle cx="22" cy="11" r="6.5" fill="${BRAND_TEAL}"/>
      <circle cx="22" cy="11" r="5" fill="${BRAND_CORAL}"/>
    </g>
  </g>`;
};

/** A schedule row, echoing the live preview card in the hero. */
const row = (y, name, when, stampText, stampBg, stampFg, last) => `
  <g>
    <text x="700" y="${y}" font-family="${FONT}" font-size="21" font-weight="600" fill="${INK}">${name}</text>
    <text x="700" y="${y + 26}" font-family="${FONT}" font-size="17" fill="${INK_2}">${when}</text>
    <rect x="1010" y="${y - 17}" width="${stampText.length * 9.2 + 24}" height="26" rx="13" fill="${stampBg}"/>
    <text x="${1010 + (stampText.length * 9.2 + 24) / 2}" y="${y + 1}" font-family="${FONT}" font-size="15"
      font-weight="500" fill="${stampFg}" text-anchor="middle">${stampText}</text>
    ${last ? '' : `<line x1="700" y1="${y + 48}" x2="1140" y2="${y + 48}" stroke="${LINE}" stroke-width="1"/>`}
  </g>`;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GROUND}"/>

  ${brandMark(72, 64, 56)}
  <text x="144" y="103" font-family="${FONT}" font-size="30" font-weight="700" fill="${INK}">MyBabyCare</text>

  <text x="72" y="228" font-family="${FONT}" font-size="60" font-weight="700" fill="${INK}">Every dose,</text>
  <text x="72" y="296" font-family="${FONT}" font-size="60" font-weight="700" fill="${INK}">on the day it is due.</text>

  <text x="72" y="358" font-family="${FONT}" font-size="24" fill="${INK_2}">The Bangladesh EPI schedule, plus the private</text>
  <text x="72" y="392" font-family="${FONT}" font-size="24" fill="${INK_2}">doses clinics recommend alongside it.</text>

  <rect x="72" y="440" width="132" height="38" rx="19" fill="#cdfee1"/>
  <text x="138" y="465" font-family="${FONT}" font-size="17" font-weight="600" fill="#0c5132" text-anchor="middle">Free to use</text>
  <rect x="216" y="440" width="196" height="38" rx="19" fill="#e3e3e3"/>
  <text x="314" y="465" font-family="${FONT}" font-size="17" font-weight="600" fill="${INK}" text-anchor="middle">26 doses tracked</text>

  <text x="72" y="556" font-family="${FONT}" font-size="20" fill="${ACCENT}" font-weight="600">mybabycare.app</text>

  <!-- The hero's live schedule card -->
  <rect x="668" y="96" width="500" height="438" rx="12" fill="${SURFACE}" stroke="${LINE}" stroke-width="1"/>
  <rect x="668" y="96" width="500" height="56" rx="12" fill="#f7f7f7"/>
  <rect x="668" y="140" width="500" height="12" fill="#f7f7f7"/>
  <line x1="668" y1="152" x2="1168" y2="152" stroke="${LINE}" stroke-width="1"/>
  <text x="700" y="131" font-family="${FONT}" font-size="18" font-weight="600" fill="${INK}">First doses on this schedule</text>

  ${row(196, 'BCG + OPV 0', 'At birth', 'Due today', '#ffd6a4', '#5e4200')}
  ${row(268, 'Pentavalent 1 + OPV 1', 'At 6 weeks', 'In 6 weeks', '#e0f0ff', '#00527c')}
  ${row(340, 'Rotavirus, dose 1', 'At 6 weeks', 'In 6 weeks', '#e0f0ff', '#00527c')}
  ${row(412, 'Pentavalent 2 + OPV 2', 'At 10 weeks', 'In 10 weeks', '#e0f0ff', '#00527c')}
  ${row(484, 'MR (Measles-Rubella)', 'At 9 months', 'In 9 months', '#e0f0ff', '#00527c', true)}
</svg>
`;

async function generateOgImage() {
  const outputPath = path.join(__dirname, '../public/og-image.png');

  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath);

  console.log('Generated:', outputPath);
}

generateOgImage().catch(console.error);
