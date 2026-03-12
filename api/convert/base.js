const { convertBase } = require('../../lib/convert');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { value, from, to } = req.query;

  if (!value && value !== '0') return error(res, 'Query parameter "value" is required.');
  if (!from) return error(res, 'Query parameter "from" is required (bin, oct, dec, or hex).');
  if (!to) return error(res, 'Query parameter "to" is required (bin, oct, dec, or hex).');

  const result = convertBase(value, from, to);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
