# Weather Nowcast

Returns precipitation readings at 15-minute intervals for the next 2 hours for any coordinates. Useful for short-range rain forecasting. Powered by [Open-Meteo](https://open-meteo.com).

```
GET /weather/nowcast
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `lat` | Yes | Latitude (-90 to 90) |
| `lon` | Yes | Longitude (-180 to 180) |

## Example

```bash
curl "https://api.uwuapps.org/weather/nowcast?lat=1.3521&lon=103.8198"
```

### Response

```json
{
  "success": true,
  "timezone": "Asia/Singapore",
  "intervalMin": 15,
  "total": 8,
  "points": [
    { "time": "2025-01-15T10:00", "precipitation": 0 },
    { "time": "2025-01-15T10:15", "precipitation": 0.2 },
    { "time": "2025-01-15T10:30", "precipitation": 1.4 },
    { "time": "2025-01-15T10:45", "precipitation": 0.8 }
  ]
}
```

## Response fields

| Field | Description |
|---|---|
| `timezone` | Timezone of the location |
| `intervalMin` | Interval between data points in minutes (always `15`) |
| `total` | Number of data points returned |
| `points` | Array of precipitation readings |
| `points[].time` | Timestamp of the interval |
| `points[].precipitation` | Precipitation amount in mm |

## Notes

- Returns up to 8 data points (2 hours at 15-minute intervals).
- Precipitation is in **millimetres (mm)** regardless of `units`.
- Returns `502` if Open-Meteo is unreachable.
- Use [Weather Search](search.md) to find coordinates for a city name.
