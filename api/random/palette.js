const { success, error, handleCors } = require('../../lib/response');

const DEFAULT_COUNT = 32;
const MAX_COUNT = 100;

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const rawCount = req.query.count;
  const count = rawCount != null ? parseInt(rawCount, 10) : DEFAULT_COUNT;

  if (isNaN(count) || count < 1) {
    return error(res, '"count" must be a positive integer.');
  }
  if (count > MAX_COUNT) {
    return error(res, `"count" cannot exceed ${MAX_COUNT}.`);
  }

  const colors = Array.from({ length: count }, () => {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    return `#${hex}`;
  });

  return success(res, { count, colors });
};
