/**
 * Parse a hex colour string into an [R, G, B] array.
 * Accepts "#rrggbb" or "rrggbb" (with or without hash).
 *
 * @param {string} hex
 * @returns {[number, number, number] | null}
 */
function hexToRGB(hex) {
  const cleaned = hex.replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return [
    parseInt(cleaned.substring(0, 2), 16),
    parseInt(cleaned.substring(2, 4), 16),
    parseInt(cleaned.substring(4, 6), 16),
  ];
}

/**
 * Calculate relative luminance of an [R, G, B] colour.
 * Uses the WCAG 2.1 formula.
 *
 * @param {[number, number, number]} rgb
 * @returns {number}
 */
function getRelativeLuminance(rgb) {
  const sRGB = rgb.map((val) => {
    const s = val / 255;
    return s < 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate WCAG contrast ratio between two [R, G, B] colours.
 *
 * @param {[number, number, number]} color1
 * @param {[number, number, number]} color2
 * @returns {number}
 */
function calculateContrastRatio(color1, color2) {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const light = Math.max(lum1, lum2);
  const dark  = Math.min(lum1, lum2);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Return a WCAG-based rating label and AA/AAA pass/fail for a contrast ratio.
 *
 * @param {number} ratio
 * @returns {{ label: string, wcagAA: boolean, wcagAAA: boolean, wcagAALarge: boolean, wcagAAALarge: boolean }}
 */
function getRating(ratio) {
  let label;
  if      (ratio > 12) label = 'Awesome!';
  else if (ratio > 7)  label = 'Good';
  else if (ratio > 5)  label = 'Meh';
  else if (ratio > 3)  label = 'Poor';
  else                 label = 'Very Poor';

  return {
    label,
    wcagAA:       ratio >= 4.5,  // normal text
    wcagAAA:      ratio >= 7,    // normal text (enhanced)
    wcagAALarge:  ratio >= 3,    // large text (18pt+ or 14pt+ bold)
    wcagAAALarge: ratio >= 4.5,  // large text (enhanced)
  };
}

/**
 * Full contrast check given two hex colour strings.
 *
 * @param {string} textHex
 * @param {string} bgHex
 * @returns {{ ratio: number, rating: object, text: string, bg: string } | { error: string }}
 */
function checkContrast(textHex, bgHex) {
  const textRGB = hexToRGB(textHex);
  if (!textRGB) return { error: `Invalid hex colour for "text": ${textHex}` };

  const bgRGB = hexToRGB(bgHex);
  if (!bgRGB) return { error: `Invalid hex colour for "bg": ${bgHex}` };

  const ratio = calculateContrastRatio(textRGB, bgRGB);

  return {
    text:  textHex.startsWith('#') ? textHex : `#${textHex}`,
    bg:    bgHex.startsWith('#')   ? bgHex   : `#${bgHex}`,
    ratio: parseFloat(ratio.toFixed(2)),
    rating: getRating(ratio),
  };
}

module.exports = { checkContrast };
