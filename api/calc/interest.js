const { calculateInterest } = require('../../lib/calc');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const principal = parseFloat(req.query.principal);
  const rate = parseFloat(req.query.rate);
  const time = parseFloat(req.query.time);
  const duration = (req.query.duration || 'year').toLowerCase();

  if (isNaN(principal)) return error(res, 'Query parameter "principal" is required (number).');
  if (isNaN(rate)) return error(res, 'Query parameter "rate" is required (number).');
  if (isNaN(time)) return error(res, 'Query parameter "time" is required (number).');
  if (duration !== 'year' && duration !== 'month') {
    return error(res, 'Query parameter "duration" must be "year" or "month".');
  }

  const result = calculateInterest(principal, rate, time, duration);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
