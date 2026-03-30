const { success, error, handleCors } = require('../../lib/response');

const PSI_URL = 'https://api.data.gov.sg/v1/environment/psi';

/**
 * Get today's date in SGT as YYYY-MM-DD.
 * @returns {string}
 */
function sgtToday() {
  return new Date(
    Date.now() + 8 * 60 * 60 * 1000  // shift UTC → SGT
  ).toISOString().slice(0, 10);
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const metric = req.query.metric || 'psi_twenty_four_hourly';
  const date   = req.query.date   || sgtToday();

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return error(res, '"date" must be in YYYY-MM-DD format.');
  }

  const url = new URL(PSI_URL);
  url.searchParams.set('date', date);

  let json;
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return error(res, `data.gov.sg PSI API returned status ${response.status}.`, 502);
    }
    json = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach data.gov.sg. Please try again.', 502);
  }

  const items = json.items || [];
  if (!items.length) {
    return res.status(404).json({
      success: false,
      message: `No PSI readings found for ${date}.`,
    });
  }

  // Build time series: [{ timestamp, national, west, east, central, south, north }]
  const REGIONS = ['national', 'west', 'east', 'central', 'south', 'north'];
  const series = items.map(item => {
    const ts       = item.timestamp || item.update_timestamp || item.reading_timestamp;
    const readings = item.readings || {};
    const block    = readings[metric] || readings.psi_twenty_four_hourly || {};
    const point    = { timestamp: ts };
    for (const r of REGIONS) point[r] = block[r] ?? null;
    return point;
  }).filter(p => p.national !== null);

  return success(res, {
    date,
    metric,
    count:  series.length,
    series,
  });
};
