const { success, error, handleCors } = require('../../lib/response');

const MAX_FLIPS = 100;

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const rawFlips = req.query.flips;
  const flips = rawFlips != null ? parseInt(rawFlips, 10) : 1;

  if (isNaN(flips) || flips < 1) {
    return error(res, '"flips" must be a positive integer.');
  }
  if (flips > MAX_FLIPS) {
    return error(res, `"flips" cannot exceed ${MAX_FLIPS}.`);
  }

  const results = Array.from({ length: flips }, () =>
    Math.random() < 0.5 ? 'heads' : 'tails'
  );

  const heads = results.filter(r => r === 'heads').length;
  const tails = flips - heads;

  // Single flip — keep response flat
  if (flips === 1) {
    return success(res, { result: results[0] });
  }

  // Multiple flips — return full breakdown
  return success(res, {
    flips,
    results,
    heads,
    tails,
  });
};
