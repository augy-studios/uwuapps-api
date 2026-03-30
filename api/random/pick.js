const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { choices, count } = req.query;

  if (!choices || choices.trim().length === 0) {
    return error(res, 'Query parameter "choices" is required (comma-separated list).');
  }

  const items = choices.split(',').map(c => c.trim()).filter(Boolean);
  if (items.length === 0) {
    return error(res, '"choices" must contain at least one item.');
  }

  const n = count != null ? parseInt(count, 10) : 1;
  if (isNaN(n) || n < 1) return error(res, '"count" must be a positive integer.');
  if (n > items.length) {
    return error(res, `"count" (${n}) cannot exceed the number of choices (${items.length}).`);
  }

  // Fisher-Yates shuffle, take first n
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, n);

  return success(res, {
    picked,
    count: picked.length,
    from:  items.length,
  });
};
