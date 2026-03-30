/**
 * Validate a hex colour string (with or without leading #).
 * @param {string} hex
 * @returns {boolean}
 */
function isValidHex(hex) {
  return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

/**
 * Normalise hex to always include leading #.
 * @param {string} hex
 * @returns {string}
 */
function normaliseHex(hex) {
  return hex.startsWith('#') ? hex : `#${hex}`;
}

/**
 * Validate and normalise a direction value.
 * Accepts degrees like "180deg", "180", or CSS keywords like "to right".
 * @param {string} direction
 * @returns {string} normalised direction string
 */
function normaliseDirection(direction) {
  const str = String(direction).trim();

  // CSS keyword directions
  const keywords = [
    'to top', 'to bottom', 'to left', 'to right',
    'to top left', 'to top right', 'to bottom left', 'to bottom right',
  ];
  if (keywords.includes(str.toLowerCase())) return str.toLowerCase();

  // Numeric degrees — strip "deg" suffix if present, then re-add
  const num = parseFloat(str.replace(/deg$/i, ''));
  if (!isNaN(num)) return `${num}deg`;

  return null;
}

/**
 * Generate CSS gradient code from two colours and a direction.
 *
 * @param {string} colorA     - Start hex colour (e.g. "#ff0000")
 * @param {string} colorB     - End hex colour (e.g. "#0000ff")
 * @param {string} direction  - Angle or keyword (default "180deg")
 * @returns {{ css: object, colorA: string, colorB: string, direction: string } | { error: string }}
 */
function generateGradient(colorA, colorB, direction = '180deg') {
  if (!colorA) return { error: '"colorA" is required.' };
  if (!colorB) return { error: '"colorB" is required.' };

  if (!isValidHex(colorA)) return { error: `Invalid hex colour for "colorA": ${colorA}` };
  if (!isValidHex(colorB)) return { error: `Invalid hex colour for "colorB": ${colorB}` };

  const a   = normaliseHex(colorA);
  const b   = normaliseHex(colorB);
  const dir = normaliseDirection(direction);

  if (!dir) return { error: `Invalid direction: "${direction}". Use degrees (e.g. 180deg) or CSS keywords (e.g. "to right").` };

  return {
    colorA: a,
    colorB: b,
    direction: dir,
    css: {
      standard: `linear-gradient(${dir}, ${a} 0%, ${b} 100%)`,
      moz:      `-moz-linear-gradient(${dir}, ${a} 0%, ${b} 100%)`,
      webkit:   `-webkit-linear-gradient(${dir}, ${a} 0%, ${b} 100%)`,
      filter:   `progid:DXImageTransform.Microsoft.gradient(startColorstr="${a}",endColorstr="${b}",GradientType=1)`,
      full: `background: ${a};
background: -moz-linear-gradient(${dir}, ${a} 0%, ${b} 100%);
background: -webkit-linear-gradient(${dir}, ${a} 0%, ${b} 100%);
background: linear-gradient(${dir}, ${a} 0%, ${b} 100%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="${a}",endColorstr="${b}",GradientType=1);`,
    },
  };
}

module.exports = { generateGradient };
