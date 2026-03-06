const { validateNric } = require('./_utils');

/**
 * GET /api/nric/validate
 *
 * Query parameters:
 *   nric - (required) The 9-character NRIC string to validate.
 *
 * Response: { nric: string, valid: boolean }
 */
module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const nric = req.query.nric;

  if (!nric) {
    return res.status(400).json({ error: 'Missing required query parameter: nric' });
  }

  const upper = nric.toUpperCase();
  const valid = validateNric(upper);

  return res.status(200).json({ nric: upper, valid });
};
