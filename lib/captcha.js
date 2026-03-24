const crypto = require('crypto');

const ALL_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CAPTCHA_LENGTH = 6;
const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a random captcha string.
 * @returns {string} e.g. "aB3xZq"
 */
function generateCaptchaValue() {
  let result = '';
  for (let i = 0; i < CAPTCHA_LENGTH; i++) {
    result += ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
  }
  return result;
}

/**
 * Sign a captcha value + expiry timestamp into an HMAC token.
 * Token format (base64url): "<captchaLower>.<expiry>.<hmac>"
 *
 * @param {string} captchaValue
 * @param {string} secret
 * @returns {string} signed token
 */
function signCaptcha(captchaValue, secret) {
  const expiry = Date.now() + TOKEN_TTL_MS;
  const payload = `${captchaValue.toLowerCase()}.${expiry}`;
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');
  return Buffer.from(`${payload}.${hmac}`).toString('base64url');
}

/**
 * Verify a user's input against a signed token.
 *
 * @param {string} input       - User-submitted captcha text
 * @param {string} token       - Token from /captcha/generate
 * @param {string} secret
 * @returns {{ valid: boolean, reason?: string }}
 */
function verifyCaptcha(input, token, secret) {
  let decoded;
  try {
    decoded = Buffer.from(token, 'base64url').toString('utf8');
  } catch {
    return { valid: false, reason: 'Malformed token.' };
  }

  const parts = decoded.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'Malformed token.' };

  const [captchaLower, expiryStr, providedHmac] = parts;
  const expiry = parseInt(expiryStr, 10);

  if (isNaN(expiry) || Date.now() > expiry) {
    return { valid: false, reason: 'Token expired. Please generate a new captcha.' };
  }

  const payload = `${captchaLower}.${expiryStr}`;
  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  const hmacMatch =
    providedHmac.length === expectedHmac.length &&
    crypto.timingSafeEqual(
      Buffer.from(providedHmac),
      Buffer.from(expectedHmac)
    );

  if (!hmacMatch) return { valid: false, reason: 'Invalid token.' };

  const inputNorm = input.trim().toLowerCase();
  if (inputNorm !== captchaLower) {
    return { valid: false, reason: 'Captcha does not match.' };
  }

  return { valid: true };
}

module.exports = { generateCaptchaValue, signCaptcha, verifyCaptcha };
