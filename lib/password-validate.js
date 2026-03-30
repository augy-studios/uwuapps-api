/**
 * Validate a password against common strength requirements.
 *
 * @param {string} password
 * @returns {{ requirements: object, passed: number, total: number, strength: string } | { error: string }}
 */
function validatePassword(password) {
  if (password == null || password === '') {
    return { error: '"password" is required.' };
  }

  const checks = {
    minLength:    /.{8,}/.test(password),
    hasNumber:    /[0-9]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial:   /[^A-Za-z0-9]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const total  = Object.keys(checks).length;

  const strength =
    passed <= 2 ? 'weak'   :
    passed <= 3 ? 'fair'   :
    passed === 4 ? 'good'  : 'strong';

  return {
    passed,
    total,
    strength,
    requirements: checks,
  };
}

module.exports = { validatePassword };
