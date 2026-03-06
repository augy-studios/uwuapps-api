// Checksum letter lookup for S/T prefixes
const CHECKSUM_ST = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

// Checksum letter lookup for F/G prefixes
const CHECKSUM_FG = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];

// Weights for NRIC checksum calculation
const WEIGHTS = [2, 7, 6, 5, 4, 3, 2];

/**
 * Calculate the checksum letter for an NRIC.
 * @param {string} prefix - The first letter (S, T, F, G)
 * @param {number[]} digits - Array of 7 digits
 * @returns {string} The checksum letter
 */
function getChecksumLetter(prefix, digits) {
  let sum = digits.reduce((acc, d, i) => acc + d * WEIGHTS[i], 0);

  if (prefix === 'T' || prefix === 'G') {
    sum += 4;
  }

  const remainder = sum % 11;

  if (prefix === 'S' || prefix === 'T') {
    return CHECKSUM_ST[remainder];
  }
  return CHECKSUM_FG[remainder];
}

/**
 * Validate a full 9-character NRIC string.
 * @param {string} nric - The NRIC string (e.g. "S1234567D")
 * @returns {boolean}
 */
function validateNric(nric) {
  if (typeof nric !== 'string' || nric.length !== 9) return false;

  const upper = nric.toUpperCase();
  const prefix = upper[0];

  if (!['S', 'T', 'F', 'G'].includes(prefix)) return false;

  const digitStr = upper.slice(1, 8);
  if (!/^\d{7}$/.test(digitStr)) return false;

  const digits = digitStr.split('').map(Number);
  const expectedLetter = getChecksumLetter(prefix, digits);

  return upper[8] === expectedLetter;
}

module.exports = { CHECKSUM_ST, CHECKSUM_FG, WEIGHTS, getChecksumLetter, validateNric };
