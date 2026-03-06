const { validateNric } = require('./_utils');

/**
 * GET /api/nric/reconstruct
 *
 * Reconstructs possible NRIC numbers from partial information.
 *
 * Query parameters:
 *   last        - (required) Known last N characters of the NRIC (digits + checksum letter).
 *                 e.g. "567D" means the last 4 chars are known.
 *   year        - (required) 4-digit year of birth, e.g. "1990".
 *   citizenship - (required) S = Singaporean, P = PR, F = Foreigner.
 *   born_sg     - (required) Y or N — whether born in Singapore.
 *   month       - (optional) 3-letter birth month, e.g. "Jan". Narrows results using
 *                 SingStat birth registration data (only works for SG-born citizens/PRs).
 *
 * Response: { count: number, nrics: string[] }
 *
 * NOTE: The SingStat API integration for month-based filtering is included but
 *       depends on the external API being available. If the API is unreachable,
 *       the month filter is skipped and all prefix-matched results are returned.
 */

const SINGSTAT_BIRTH_URL = 'https://tablebuilder.singstat.gov.sg/api/table/tabledata/M810051';

const MONTH_INDEX = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Determine the NRIC prefix letter from citizenship and year.
 */
function getPrefix(citizenship, year) {
  const y = parseInt(year, 10);
  if (citizenship === 'S' || citizenship === 'P') {
    return y >= 2000 ? 'T' : 'S';
  }
  // Foreigner
  return y >= 2000 ? 'G' : 'F';
}

/**
 * Generate all permutations of `length` digits (0–9).
 * Returns an iterator to avoid massive arrays in memory.
 */
function* digitPermutations(length) {
  if (length === 0) {
    yield '';
    return;
  }
  for (let d = 0; d <= 9; d++) {
    for (const rest of digitPermutations(length - 1)) {
      yield String(d) + rest;
    }
  }
}

/**
 * Build a regex pattern to filter candidates.
 *   - For SG-born: digit at position index 2 (0-indexed in the 7-digit body) is 0–5
 *   - For non-SG-born: digit at position index 2 is 5–9
 * The pattern covers: prefix + YY + [range] + unknown dots + known suffix
 */
function buildPattern(prefix, year, bornSg, lastChars) {
  const yy = year.slice(2);
  const rangeChar = bornSg === 'Y' ? '[0-5]' : '[5-9]';
  // lastChars includes the checksum letter at the end
  // Total NRIC body = 7 digits. We know the last (lastChars.length - 1) digits plus checksum.
  // The first 2 digits are the year. Then 1 digit is the range. The rest are unknown.
  const knownDigits = lastChars.length - 1; // digits known (excluding checksum letter)
  const unknownCount = 7 - 2 - 1 - knownDigits; // total 7 minus YY(2) minus range(1) minus known
  const dots = '.'.repeat(Math.max(unknownCount, 0));
  return new RegExp(`^${prefix}${yy}${rangeChar}${dots}${escapeRegex(lastChars)}$`, 'i');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Fetch monthly birth data from SingStat and filter NRICs by birth registration range.
 */
async function filterByMonth(nrics, year, month) {
  try {
    const resp = await fetch(`${SINGSTAT_BIRTH_URL}?seriesNo=1`);
    if (!resp.ok) return nrics; // fallback: skip month filter

    const json = await resp.json();
    const rows = json.Data.row[0].columns;

    // Extract monthly births for the given year
    const yearBirths = rows
      .filter((r) => r.key.startsWith(year))
      .map((r) => parseInt(parseFloat(r.value), 10) || 0);

    if (yearBirths.length === 0) return nrics;

    const mi = MONTH_INDEX[month.toLowerCase()];
    if (mi === undefined) return nrics;

    const lower = Math.max(mi - 1, 0);
    const upper = Math.min(mi + 1, 11);

    // Cumulative births up to boundary months
    const cumLower = yearBirths.slice(0, lower).reduce((a, b) => a + b, 0);
    const cumUpper = yearBirths.slice(0, upper).reduce((a, b) => a + b, 0);

    return nrics.filter((nric) => {
      const seqNum = parseInt(nric.slice(3, 8), 10);
      return seqNum >= cumLower && seqNum < cumUpper;
    });
  } catch {
    // If SingStat API fails, return unfiltered
    return nrics;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { last, year, citizenship, born_sg, month } = req.query;

  // --- Validation ---
  if (!last || !year || !citizenship || !born_sg) {
    return res.status(400).json({
      error: 'Missing required parameters. Need: last, year, citizenship, born_sg',
    });
  }

  const upperCitizenship = citizenship.toUpperCase();
  if (!['S', 'P', 'F'].includes(upperCitizenship)) {
    return res.status(400).json({ error: 'citizenship must be S, P, or F.' });
  }

  if (!/^\d{4}$/.test(year)) {
    return res.status(400).json({ error: 'year must be a 4-digit number.' });
  }

  const upperBornSg = born_sg.toUpperCase();
  if (!['Y', 'N'].includes(upperBornSg)) {
    return res.status(400).json({ error: 'born_sg must be Y or N.' });
  }

  const upperLast = last.toUpperCase();
  const knownDigitCount = upperLast.length - 1; // last char is checksum letter
  if (knownDigitCount < 0 || knownDigitCount > 7) {
    return res.status(400).json({ error: 'last must be 1–8 characters (digits + checksum letter).' });
  }

  // --- Determine prefix ---
  const prefix = getPrefix(upperCitizenship, year);

  // --- Brute-force candidates ---
  // We know: prefix (1) + YY (2) from year + range digit (1, constrained) + unknown digits + known last chars
  // Total NRIC = prefix + 7 digits + checksum = 9 chars
  // known suffix = upperLast (includes checksum letter)
  // unknownDigits = 7 - 2(YY) - knownDigitCount  ... but we also need range digit
  // Actually, let's just brute force the unknown middle portion.

  const yy = year.slice(2);
  const checksumLetter = upperLast.slice(-1);
  const knownDigits = upperLast.slice(0, -1); // the known trailing digits (without checksum)

  // Body = 7 digits. First 2 = yy. Remaining 5 = unknown prefix + known suffix digits.
  const unknownCount = 5 - knownDigits.length;

  if (unknownCount < 0) {
    return res.status(400).json({ error: 'Too many known characters for the given constraints.' });
  }

  // Cap brute-force to prevent timeout (10^5 = 100,000 is manageable)
  if (unknownCount > 5) {
    return res.status(400).json({ error: 'Need at least the checksum letter to reconstruct.' });
  }

  const pattern = buildPattern(prefix, year, upperBornSg, upperLast);
  const candidates = [];

  for (const combo of digitPermutations(unknownCount)) {
    const body = yy + combo + knownDigits;
    const nric = prefix + body + checksumLetter;

    if (nric.length === 9 && pattern.test(nric) && validateNric(nric)) {
      candidates.push(nric);
    }
  }

  // --- Optional month filter ---
  let results = candidates;
  if (month) {
    results = await filterByMonth(candidates, year, month);
  }

  // Cap output to prevent huge payloads
  const MAX_RESULTS = 1000;
  const truncated = results.length > MAX_RESULTS;

  return res.status(200).json({
    count: results.length,
    truncated,
    nrics: results.slice(0, MAX_RESULTS),
  });
};
