const { convertMorse } = require('../../lib/convert');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { text } = req.query;
  if (!text) return error(res, 'Query parameter "text" is required.');

  const result = convertMorse(text);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
