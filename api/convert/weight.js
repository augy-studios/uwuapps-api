const { convertWeight } = require('../../lib/convert');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const value = parseFloat(req.query.value);
  const { from, to } = req.query;

  if (isNaN(value)) return error(res, 'Query parameter "value" is required (number).');
  if (!from) return error(res, 'Query parameter "from" is required (kg, lb, or oz).');
  if (!to) return error(res, 'Query parameter "to" is required (kg, lb, or oz).');

  const result = convertWeight(value, from, to);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
