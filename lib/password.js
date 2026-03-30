const CHARS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers:   '0123456789',
  symbols:   '^!$%&|[](){}:;.,*+-#@<>~',
};

/**
 * Generate a password based on given options.
 *
 * @param {object} opts
 * @param {number}  opts.length     - Password length (default 16, max 128)
 * @param {boolean} opts.numbers    - Include numbers (default true)
 * @param {boolean} opts.uppercase  - Include uppercase (default true)
 * @param {boolean} opts.symbols    - Include symbols (default false)
 * @param {boolean} opts.spaces     - Include spaces (default false)
 * @param {boolean} opts.excDupe    - Exclude duplicate characters (default false)
 * @returns {{ password: string, length: number, strength: string } | { error: string }}
 */
function generatePassword(opts = {}) {
  const length    = opts.length    != null ? parseInt(opts.length, 10) : 16;
  const numbers   = opts.numbers   != null ? opts.numbers   !== 'false' && opts.numbers   !== false : true;
  const uppercase = opts.uppercase != null ? opts.uppercase !== 'false' && opts.uppercase !== false : true;
  const symbols   = opts.symbols   != null ? opts.symbols   !== 'false' && opts.symbols   !== false : false;
  const spaces    = opts.spaces    != null ? opts.spaces    !== 'false' && opts.spaces    !== false : false;
  const excDupe   = opts.excDupe   != null ? opts.excDupe   !== 'false' && opts.excDupe   !== false : false;

  if (isNaN(length) || length < 1)   return { error: '"length" must be a positive integer.' };
  if (length > 128)                   return { error: '"length" cannot exceed 128.' };

  // Build character pool
  let pool = CHARS.lowercase;
  if (uppercase) pool += CHARS.uppercase;
  if (numbers)   pool += CHARS.numbers;
  if (symbols)   pool += CHARS.symbols;
  if (spaces)    pool = `  ${pool}  `;

  if (!pool.trim().length) return { error: 'No character sets selected.' };

  // Enforce excDupe limit
  const uniqueChars = [...new Set(pool)];
  if (excDupe && length > uniqueChars.length) {
    return {
      error: `Cannot generate a ${length}-character password without duplicates — only ${uniqueChars.length} unique characters available.`,
    };
  }

  let password = '';
  let attempts = 0;
  while (password.length < length) {
    if (++attempts > length * 10) break; // safety valve
    const char = pool[Math.floor(Math.random() * pool.length)];
    if (excDupe && password.includes(char) && char !== ' ') continue;
    password += char;
  }

  const strength =
    length <= 7  ? 'weak'   :
    length <= 15 ? 'medium' : 'strong';

  return { password, length: password.length, strength };
}

module.exports = { generatePassword };
