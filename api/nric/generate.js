const { getChecksumLetter } = require('./_utils');

/**
 * GET /api/nric/generate
 *
 * Query parameters:
 *   prefix  - (optional) S, T, F, or G. Random if omitted.
 *   count   - (optional) Number of NRICs to generate (1–100, default 1).
 *
 * Response: { nrics: string[] }
 */
module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prefixes = ['S', 'T', 'F', 'G'];
  const requestedPrefix = req.query.prefix?.toUpperCase();
  const count = Math.min(Math.max(parseInt(req.query.count, 10) || 1, 1), 100);

  if (requestedPrefix && !prefixes.includes(requestedPrefix)) {
    return res.status(400).json({ error: 'Invalid prefix. Must be S, T, F, or G.' });
  }

  const results = [];

  for (let i = 0; i < count; i++) {
    const prefix = requestedPrefix || prefixes[Math.floor(Math.random() * prefixes.length)];

    const digits = [];
    for (let j = 0; j < 7; j++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    const checksum = getChecksumLetter(prefix, digits);
    results.push(prefix + digits.join('') + checksum);
  }

  return res.status(200).json({ nrics: results });
};
