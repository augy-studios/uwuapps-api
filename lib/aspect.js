/**
 * Calculate the missing dimension given an aspect ratio.
 *
 * @param {number} ratioW  - Ratio width  (e.g. 16)
 * @param {number} ratioH  - Ratio height (e.g. 9)
 * @param {number|null} width  - Known width;  provide null to solve for it
 * @param {number|null} height - Known height; provide null to solve for it
 * @returns {{ width: number, height: number, ratio: string } | { error: string }}
 */
function calculateAspect(ratioW, ratioH, width, height) {
  if (!ratioW || !ratioH || ratioW <= 0 || ratioH <= 0) {
    return { error: 'ratioW and ratioH must be positive numbers.' };
  }

  const aspectRatio = ratioW / ratioH;

  if (width != null && height == null) {
    // Solve for height
    if (width <= 0) return { error: 'width must be a positive number.' };
    const solvedHeight = parseFloat((width / aspectRatio).toFixed(2));
    return { width, height: solvedHeight, ratio: `${ratioW}:${ratioH}` };
  }

  if (height != null && width == null) {
    // Solve for width
    if (height <= 0) return { error: 'height must be a positive number.' };
    const solvedWidth = parseFloat((height * aspectRatio).toFixed(2));
    return { width: solvedWidth, height, ratio: `${ratioW}:${ratioH}` };
  }

  return { error: 'Provide either "width" or "height" (not both, not neither).' };
}

module.exports = { calculateAspect };
