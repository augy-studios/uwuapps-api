const { calculateDays } = require('../../lib/calc');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { from, to } = req.query;
  if (!from) return error(res, 'Query parameter "from" is required (e.g. 2024-01-01).');
  if (!to) return error(res, 'Query parameter "to" is required (e.g. 2025-03-12).');

  const result = calculateDays(from, to);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
