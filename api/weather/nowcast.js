const { success, error, handleCors } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return error(res, 'Query parameters "lat" and "lon" are required.');
  }

  const latitude  = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude)  || latitude  < -90  || latitude  > 90)  return error(res, '"lat" must be a valid latitude (-90 to 90).');
  if (isNaN(longitude) || longitude < -180 || longitude > 180) return error(res, '"lon" must be a valid longitude (-180 to 180).');

  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone:    'auto',
    minutely_15: 'precipitation',
  });

  let json;
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) return error(res, `Open-Meteo returned status ${response.status}.`, 502);
    json = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Open-Meteo. Please try again.', 502);
  }

  const times = json.minutely_15?.time         || [];
  const prec  = json.minutely_15?.precipitation || [];
  const nowMs = Date.now();
  const twoHours = nowMs + 2 * 60 * 60 * 1000;

  // Next 2 hours of 15-minute intervals
  const points = [];
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    if (t >= nowMs && t <= twoHours) {
      points.push({
        time:          times[i],
        precipitation: prec[i] ?? 0,
      });
    }
  }

  return success(res, {
    timezone:   json.timezone ?? null,
    intervalMin: 15,
    points,
    total:      points.length,
  });
};
