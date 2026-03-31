# PSI / Air Quality (Singapore)

Returns Singapore's air quality Pollutant Standards Index (PSI) readings from [data.gov.sg](https://data.gov.sg).

```
GET /api/sg/psi
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `dateTime` | No | Latest | Specific date-time to query in `YYYY-MM-DDTHH:mm:ss` format |
| `metric` | No | `psi_twenty_four_hourly` | PSI metric to use (see below) |

## Available metrics

| Metric | Description |
|---|---|
| `psi_twenty_four_hourly` | 24-hour PSI (default) |
| `psi_three_hourly` | 3-hour PSI |
| `pm25_sub_index` | PM2.5 sub-index |
| `pm10_sub_index` | PM10 sub-index |
| `o3_sub_index` | Ozone sub-index |
| `so2_sub_index` | Sulphur dioxide sub-index |
| `co_sub_index` | Carbon monoxide sub-index |

## Example

```bash
curl "https://api.uwuapps.com/api/sg/psi"
```

### Response

```json
{
  "success": true,
  "timestamp": "2025-01-15T10:00:00+08:00",
  "metric": "psi_twenty_four_hourly",
  "national": {
    "value": 45,
    "band": {
      "max": 50,
      "name": "Good",
      "cls": "good"
    }
  },
  "primaryPollutant": {
    "key": "pm25_sub_index",
    "name": "PM2.5",
    "value": 45
  },
  "regions": [
    {
      "region": "west",
      "value": 42,
      "band": { "name": "Good", "cls": "good" },
      "pm25": 42,
      "pm10": 30,
      "o3": 20,
      "so2": 5,
      "co": 3
    },
    { "region": "east", "value": 48, "band": { "name": "Good", "cls": "good" }, "pm25": 48, "pm10": 35, "o3": 22, "so2": 6, "co": 4 },
    { "region": "central", "value": 45, "band": { "name": "Good", "cls": "good" }, "pm25": 45, "pm10": 32, "o3": 21, "so2": 5, "co": 3 },
    { "region": "south", "value": 44, "band": { "name": "Good", "cls": "good" }, "pm25": 44, "pm10": 31, "o3": 20, "so2": 5, "co": 3 },
    { "region": "north", "value": 43, "band": { "name": "Good", "cls": "good" }, "pm25": 43, "pm10": 30, "o3": 19, "so2": 5, "co": 3 }
  ]
}
```

## PSI bands

| Range | Name | Class |
|---|---|---|
| 0–50 | Good | `good` |
| 51–100 | Moderate | `moderate` |
| 101–200 | Unhealthy | `unhealthy` |
| 201–300 | Very Unhealthy | `very-unhealthy` |
| 301+ | Hazardous | `hazardous` |

## Notes

- Returns the most recent reading if `dateTime` is not specified.
- Returns `404` if no readings are available for the requested time.
- Returns `502` if data.gov.sg is unreachable.
