const { convertTemperature } = require('../../lib/convert');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const value = parseFloat(req.query.value);
  const { from, to } = req.query;

  if (isNaN(value)) return error(res, 'Query parameter "value" is required (number).');
  if (!from) return error(res, 'Query parameter "from" is required (c, f, or k).');
  if (!to) return error(res, 'Query parameter "to" is required (c, f, or k).');

  const result = convertTemperature(value, from, to);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
