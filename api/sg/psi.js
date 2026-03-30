const { success, error, handleCors } = require('../../lib/response');

const PSI_URL = 'https://api.data.gov.sg/v1/environment/psi';

const BANDS = [
  { max: 50,  name: 'Good',           cls: 'good'         },
  { max: 100, name: 'Moderate',       cls: 'moderate'     },
  { max: 200, name: 'Unhealthy',      cls: 'unhealthy'    },
  { max: 300, name: 'Very Unhealthy', cls: 'very-unhealthy' },
  { max: Infinity, name: 'Hazardous', cls: 'hazardous'    },
];

function getBand(value) {
  if (value == null || isNaN(value)) return null;
  return BANDS.find(b => value <= b.max) || BANDS[BANDS.length - 1];
}

const POLLUTANT_KEYS = [
  { key: 'pm25_sub_index', name: 'PM2.5' },
  { key: 'pm10_sub_index', name: 'PM10'  },
  { key: 'o3_sub_index',   name: 'O3'    },
  { key: 'so2_sub_index',  name: 'SO2'   },
  { key: 'co_sub_index',   name: 'CO'    },
];

function primaryPollutant(readings) {
  let maxKey = null, maxVal = -Infinity;
  for (const { key, name } of POLLUTANT_KEYS) {
    const v = readings?.[key]?.national;
    if (typeof v === 'number' && v > maxVal) {
      maxVal = v;
      maxKey = { key, name };
    }
  }
  return maxKey ? { ...maxKey, value: maxVal } : null;
}

function parseRegions(readings, metric) {
  const block = readings?.[metric] || readings?.psi_twenty_four_hourly || {};
  const regions = ['west', 'east', 'central', 'south', 'north'];
  return regions.map(region => ({
    region,
    value:  block[region] ?? null,
    band:   getBand(block[region]),
    pm25:   readings?.pm25_sub_index?.[region]  ?? null,
    pm10:   readings?.pm10_sub_index?.[region]  ?? null,
    o3:     readings?.o3_sub_index?.[region]    ?? null,
    so2:    readings?.so2_sub_index?.[region]   ?? null,
    co:     readings?.co_sub_index?.[region]    ?? null,
  }));
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { dateTime, metric = 'psi_twenty_four_hourly' } = req.query;

  const url = new URL(PSI_URL);
  if (dateTime) url.searchParams.set('date_time', dateTime);

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

  const item = json.items?.[json.items.length - 1];
  if (!item) {
    return res.status(404).json({ success: false, message: 'No PSI readings available.' });
  }

  const ts       = item.timestamp || item.update_timestamp || item.reading_timestamp;
  const readings = item.readings || {};
  const block    = readings[metric] || readings.psi_twenty_four_hourly || {};
  const national = block.national ?? null;

  return success(res, {
    timestamp:        ts,
    metric,
    national: {
      value:  national,
      band:   getBand(national),
    },
    primaryPollutant: primaryPollutant(readings),
    regions:          parseRegions(readings, metric),
  });
};
