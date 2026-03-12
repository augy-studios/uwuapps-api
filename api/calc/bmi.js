const { calculateBmi } = require('../../lib/calc');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const height = parseFloat(req.query.height);
  const weight = parseFloat(req.query.weight);
  const unit = (req.query.unit || 'metric').toLowerCase();

  if (isNaN(height)) return error(res, 'Query parameter "height" is required (number).');
  if (isNaN(weight)) return error(res, 'Query parameter "weight" is required (number).');

  const result = calculateBmi(height, weight, unit);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
