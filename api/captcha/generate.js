const { generateCaptchaValue, signCaptcha } = require('../../lib/captcha');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const secret = process.env.CAPTCHA_SECRET;
  if (!secret) return error(res, 'Server misconfiguration: CAPTCHA_SECRET is not set.', 500);

  const captcha = generateCaptchaValue();
  const token = signCaptcha(captcha, secret);

  return success(res, {
    captcha,  // display this to the user
    token,    // send this back with /captcha/verify
    expiresIn: 300, // seconds (5 minutes)
  });
};
