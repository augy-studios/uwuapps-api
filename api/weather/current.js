const { success, error, handleCors } = require('../../lib/response');

const WMO_TEXT = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  56: 'Freezing drizzle', 57: 'Freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Freezing rain', 67: 'Freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
  85: 'Snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Thunderstorm w/ heavy hail',
};

function wmoDescription(code) {
  return WMO_TEXT[code] ?? 'Unknown';
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { lat, lon, units = 'metric' } = req.query;

  if (!lat || !lon) {
    return error(res, 'Query parameters "lat" and "lon" are required.');
  }

  const latitude  = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude)  || latitude  < -90  || latitude  > 90)  return error(res, '"lat" must be a valid latitude (-90 to 90).');
  if (isNaN(longitude) || longitude < -180 || longitude > 180) return error(res, '"lon" must be a valid longitude (-180 to 180).');
  if (!['metric', 'imperial'].includes(units)) return error(res, '"units" must be "metric" or "imperial".');

  const isImperial  = units === 'imperial';
  const tempUnit    = isImperial ? 'fahrenheit' : 'celsius';
  const windUnit    = isImperial ? 'mph'        : 'kmh';

  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone:       'auto',
    forecast_days:  '7',
    temperature_unit: tempUnit,
    wind_speed_unit:  windUnit,
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'precipitation', 'weather_code', 'cloud_cover',
      'wind_speed_10m', 'wind_gusts_10m', 'wind_direction_10m', 'surface_pressure',
    ].join(','),
    hourly: [
      'temperature_2m', 'precipitation_probability', 'precipitation',
      'weather_code', 'wind_speed_10m', 'cloud_cover', 'surface_pressure',
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'precipitation_sum', 'precipitation_probability_max', 'wind_speed_10m_max',
    ].join(','),
  });

  let json;
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) return error(res, `Open-Meteo returned status ${response.status}.`, 502);
    json = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Open-Meteo. Please try again.', 502);
  }

  const c = json.current || {};

  // Shape hourly into array of objects (next 24 hours)
  const hourlyTimes = json.hourly?.time || [];
  const now         = Date.now();
  const hourly      = [];
  for (let i = 0; i < hourlyTimes.length && hourly.length < 24; i++) {
    if (new Date(hourlyTimes[i]).getTime() >= now) {
      hourly.push({
        time:                    hourlyTimes[i],
        temperature:             json.hourly.temperature_2m?.[i]             ?? null,
        precipitationProbability: json.hourly.precipitation_probability?.[i] ?? null,
        precipitation:           json.hourly.precipitation?.[i]              ?? null,
        weatherCode:             json.hourly.weather_code?.[i]               ?? null,
        weatherDescription:      wmoDescription(json.hourly.weather_code?.[i]),
        windSpeed:               json.hourly.wind_speed_10m?.[i]             ?? null,
        cloudCover:              json.hourly.cloud_cover?.[i]                ?? null,
      });
    }
  }

  // Shape daily into array of objects
  const dailyTimes = json.daily?.time || [];
  const daily      = dailyTimes.slice(0, 7).map((t, i) => ({
    date:                      t,
    weatherCode:               json.daily.weather_code?.[i]                    ?? null,
    weatherDescription:        wmoDescription(json.daily.weather_code?.[i]),
    tempMax:                   json.daily.temperature_2m_max?.[i]              ?? null,
    tempMin:                   json.daily.temperature_2m_min?.[i]              ?? null,
    precipitationSum:          json.daily.precipitation_sum?.[i]               ?? null,
    precipitationProbabilityMax: json.daily.precipitation_probability_max?.[i] ?? null,
    windSpeedMax:              json.daily.wind_speed_10m_max?.[i]              ?? null,
  }));

  return success(res, {
    units,
    tempUnit:  isImperial ? '°F' : '°C',
    windUnit:  isImperial ? 'mph' : 'km/h',
    timezone:  json.timezone ?? null,
    current: {
      time:              c.time                    ?? null,
      temperature:       c.temperature_2m          ?? null,
      apparentTemp:      c.apparent_temperature    ?? null,
      humidity:          c.relative_humidity_2m    ?? null,
      precipitation:     c.precipitation           ?? null,
      weatherCode:       c.weather_code            ?? null,
      weatherDescription: wmoDescription(c.weather_code),
      cloudCover:        c.cloud_cover             ?? null,
      windSpeed:         c.wind_speed_10m          ?? null,
      windGusts:         c.wind_gusts_10m          ?? null,
      windDirection:     c.wind_direction_10m      ?? null,
      pressure:          c.surface_pressure        ?? null,
    },
    hourly,
    daily,
  });
};
