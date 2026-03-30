const { success, error, handleCors } = require('../../lib/response');

const DEFAULT_SEGMENTS = ['1', '2', '3', '4', '5', '6'];
const MAX_SEGMENTS = 100;

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  // Parse segments
  const raw = req.query.segments;
  const segments = raw
    ? raw.split(',').map(s => s.trim()).filter(Boolean)
    : DEFAULT_SEGMENTS;

  if (segments.length < 2) {
    return error(res, '"segments" must contain at least 2 items.');
  }
  if (segments.length > MAX_SEGMENTS) {
    return error(res, `"segments" cannot exceed ${MAX_SEGMENTS} items.`);
  }

  // Random degree 0–359
  const degree = Math.floor(Math.random() * 360);

  // Map degree to segment — divide wheel evenly
  const segmentSize = 360 / segments.length;
  const index = Math.floor(degree / segmentSize) % segments.length;
  const result = segments[index];

  return success(res, {
    degree,
    result,
    segmentIndex: index,
    segments,
  });
};
