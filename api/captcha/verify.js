const { verifyCaptcha } = require('../../lib/captcha');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const secret = process.env.CAPTCHA_SECRET;
  if (!secret) return error(res, 'Server misconfiguration: CAPTCHA_SECRET is not set.', 500);

  const { input, token } = req.query;
  if (!input) return error(res, 'Query parameter "input" is required.');
  if (!token) return error(res, 'Query parameter "token" is required.');

  const result = verifyCaptcha(input, token, secret);

  if (!result.valid) {
    return res.status(422).json({
      success: false,
      valid: false,
      reason: result.reason,
    });
  }

  return success(res, { valid: true });
};
