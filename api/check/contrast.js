const { checkContrast } = require('../../lib/contrast');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { text, bg } = req.query;
  if (!text) return error(res, 'Query parameter "text" is required (hex colour, e.g. #ffffff).');
  if (!bg)   return error(res, 'Query parameter "bg" is required (hex colour, e.g. #000000).');

  const result = checkContrast(text, bg);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
