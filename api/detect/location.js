const { success, error, handleCors } = require('../../lib/response');

const OPENCAGE_URL = 'https://api.opencagedata.com/geocode/v1/json';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const apiKey = process.env.OPENCAGE_API_KEY;
  if (!apiKey) return error(res, 'Server misconfiguration: OPENCAGE_API_KEY is not set.', 500);

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return error(res, 'Query parameters "lat" and "lon" are required.');
  }

  const latitude  = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude)  || latitude  < -90  || latitude  > 90)  return error(res, '"lat" must be a valid latitude (-90 to 90).');
  if (isNaN(longitude) || longitude < -180 || longitude > 180) return error(res, '"lon" must be a valid longitude (-180 to 180).');

  let data;
  try {
    const url = `${OPENCAGE_URL}?q=${latitude}+${longitude}&key=${apiKey}&limit=1&no_annotations=1`;
    const response = await fetch(url);
    if (!response.ok) {
      return error(res, `OpenCage returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach OpenCage. Please try again.', 502);
  }

  if (!data.results || data.results.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No location found for coordinates (${latitude}, ${longitude}).`,
    });
  }

  const c = data.results[0].components || {};

  return success(res, {
    lat:         latitude,
    lon:         longitude,
    road:        c.road        || c.pedestrian || c.footway || null,
    suburb:      c.suburb      || c.neighbourhood || null,
    county:      c.county      || c.state_district || null,
    city:        c.city        || c.town || c.village || null,
    state:       c.state       || null,
    postcode:    c.postcode    || null,
    country:     c.country     || null,
    countryCode: c.country_code?.toUpperCase() || null,
    formatted:   data.results[0].formatted || null,
  });
};
