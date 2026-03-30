const { validatePassword } = require('../../lib/password-validate');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { password } = req.query;

  if (password == null || password === '') {
    return error(res, 'Query parameter "password" is required.');
  }

  const result = validatePassword(password);
  if (result.error) return error(res, result.error);

  return success(res, { password, ...result });
};
