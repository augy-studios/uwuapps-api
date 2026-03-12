const { convertCurrency } = require('../../lib/convert');
const { success, error, handleCors } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const amount = parseFloat(req.query.amount);
  const { from, to } = req.query;

  if (isNaN(amount)) return error(res, 'Query parameter "amount" is required (number).');
  if (!from) return error(res, 'Query parameter "from" is required (e.g. SGD).');
  if (!to) return error(res, 'Query parameter "to" is required (e.g. MYR).');

  try {
    const result = await convertCurrency(amount, from, to);
    if (result.error) return error(res, result.error);
    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to fetch exchange rates. Try again later.', 502);
  }
};
