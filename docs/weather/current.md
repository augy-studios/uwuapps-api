# Current Weather

Returns current conditions, 24-hour hourly forecast, and 7-day daily forecast for any coordinates. Powered by [Open-Meteo](https://open-meteo.com) (free, no API key required).

```
GET /weather/current
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `lat` | Yes | — | Latitude (-90 to 90) |
| `lon` | Yes | — | Longitude (-180 to 180) |
| `units` | No | `metric` | Unit system: `metric` or `imperial` |

## Units

| `units` | Temperature | Wind speed |
|---|---|---|
| `metric` | °C | km/h |
| `imperial` | °F | mph |

## Example

```bash
curl "https://api.uwuapps.org/weather/current?lat=1.3521&lon=103.8198"
```

### Response

```json
{
  "success": true,
  "units": "metric",
  "tempUnit": "°C",
  "windUnit": "km/h",
  "timezone": "Asia/Singapore",
  "current": {
    "time": "2025-01-15T10:00",
    "temperature": 29,
    "apparentTemp": 34,
    "humidity": 80,
    "precipitation": 0,
    "weatherCode": 3,
    "weatherDescription": "Overcast",
    "cloudCover": 95,
    "windSpeed": 14,
    "windGusts": 22,
    "windDirection": 180,
    "pressure": 1010
  },
  "hourly": [
    {
      "time": "2025-01-15T10:00",
      "temperature": 29,
      "precipitationProbability": 20,
      "precipitation": 0,
      "weatherCode": 3,
      "weatherDescription": "Overcast",
      "windSpeed": 14,
      "cloudCover": 95
    }
  ],
  "daily": [
    {
      "date": "2025-01-15",
      "weatherCode": 80,
      "weatherDescription": "Rain showers",
      "tempMax": 32,
      "tempMin": 25,
      "precipitationSum": 4.2,
      "precipitationProbabilityMax": 70,
      "windSpeedMax": 20
    }
  ]
}
```

## Response fields

### `current`

| Field | Description |
|---|---|
| `time` | Timestamp of the observation |
| `temperature` | Air temperature |
| `apparentTemp` | Feels-like temperature |
| `humidity` | Relative humidity (%) |
| `precipitation` | Precipitation in the last hour (mm) |
| `weatherCode` | WMO weather interpretation code |
| `weatherDescription` | Human-readable weather description |
| `cloudCover` | Cloud cover (%) |
| `windSpeed` | Wind speed at 10 m |
| `windGusts` | Wind gusts at 10 m |
| `windDirection` | Wind direction in degrees (0 = North) |
| `pressure` | Surface pressure (hPa) |

### `hourly` (next 24 hours)

| Field | Description |
|---|---|
| `time` | Hour timestamp |
| `temperature` | Air temperature |
| `precipitationProbability` | Probability of precipitation (%) |
| `precipitation` | Expected precipitation (mm) |
| `weatherCode` | WMO weather code |
| `weatherDescription` | Human-readable description |
| `windSpeed` | Wind speed at 10 m |
| `cloudCover` | Cloud cover (%) |

### `daily` (next 7 days)

| Field | Description |
|---|---|
| `date` | Date |
| `weatherCode` | WMO weather code |
| `weatherDescription` | Human-readable description |
| `tempMax` | Maximum temperature |
| `tempMin` | Minimum temperature |
| `precipitationSum` | Total precipitation (mm) |
| `precipitationProbabilityMax` | Max precipitation probability (%) |
| `windSpeedMax` | Max wind speed |

## WMO weather codes (common)

| Code | Description |
|---|---|
| 0 | Clear |
| 1–3 | Mainly clear / Partly cloudy / Overcast |
| 45, 48 | Fog |
| 51–55 | Drizzle |
| 61–65 | Rain |
| 71–77 | Snow |
| 80–82 | Rain showers |
| 95 | Thunderstorm |
| 96, 99 | Thunderstorm with hail |

## Notes

- Returns `502` if Open-Meteo is unreachable.
- Use [Weather Search](search.md) to find `lat`/`lon` coordinates for a city name.
