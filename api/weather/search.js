const { success, error, handleCors } = require('../../lib/response');

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { q, countryCode, count = '8' } = req.query;

  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. Singapore).');
  }

  const n = parseInt(count, 10);
  if (isNaN(n) || n < 1 || n > 20) {
    return error(res, '"count" must be an integer between 1 and 20.');
  }

  const params = new URLSearchParams({
    name:     q.trim(),
    count:    String(n),
    language: 'en',
    format:   'json',
  });
  if (countryCode) params.set('countryCode', countryCode.toUpperCase());

  let json;
  try {
    const response = await fetch(`${GEOCODING_URL}?${params}`);
    if (!response.ok) return error(res, `Open-Meteo geocoding returned status ${response.status}.`, 502);
    json = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Open-Meteo geocoding. Please try again.', 502);
  }

  const results = (json.results || []).map(r => ({
    name:        r.name,
    displayName: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}, ${r.country_code}`,
    admin1:      r.admin1      ?? null,
    country:     r.country     ?? null,
    countryCode: r.country_code,
    lat:         r.latitude,
    lon:         r.longitude,
    elevation:   r.elevation   ?? null,
    timezone:    r.timezone    ?? null,
    population:  r.population  ?? null,
  }));

  if (!results.length) {
    return res.status(404).json({
      success: false,
      message: `No locations found for "${q}".`,
    });
  }

  return success(res, {
    query:   q.trim(),
    total:   results.length,
    results,
  });
};
