const { generatePassword } = require('../../lib/password');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const result = generatePassword(req.query);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
