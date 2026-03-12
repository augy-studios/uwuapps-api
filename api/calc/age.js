const { calculateAge } = require('../../lib/calc');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { date, ref } = req.query;
  if (!date) return error(res, 'Query parameter "date" is required (e.g. 2000-01-15).');

  const result = calculateAge(date, ref || null);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
