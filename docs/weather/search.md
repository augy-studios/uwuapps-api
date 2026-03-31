# Weather Location Search

Searches for locations by name and returns coordinates suitable for use with [Current Weather](current.md) and [Nowcast](nowcast.md). Powered by the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api).

```
GET /weather/search
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `q` | Yes | — | Location name to search (e.g. `Singapore`, `London`) |
| `count` | No | `8` | Number of results to return (1–20) |
| `countryCode` | No | — | Filter by ISO 3166-1 alpha-2 country code (e.g. `SG`, `GB`) |

## Example

```bash
curl "https://api.uwuapps.org/weather/search?q=Singapore"
```

**With country filter:**

```bash
curl "https://api.uwuapps.org/weather/search?q=Springfield&countryCode=US&count=5"
```

### Response

```json
{
  "success": true,
  "query": "Singapore",
  "total": 1,
  "results": [
    {
      "name": "Singapore",
      "displayName": "Singapore, SG",
      "admin1": null,
      "country": "Singapore",
      "countryCode": "SG",
      "lat": 1.28967,
      "lon": 103.85007,
      "elevation": 15,
      "timezone": "Asia/Singapore",
      "population": 3547809
    }
  ]
}
```

## Response fields

| Field | Description |
|---|---|
| `query` | The search query used |
| `total` | Number of results returned |
| `results[].name` | Location name |
| `results[].displayName` | Formatted display name (name, region, country code) |
| `results[].admin1` | State, province, or region (if available) |
| `results[].country` | Country name |
| `results[].countryCode` | ISO 3166-1 alpha-2 country code |
| `results[].lat` | Latitude |
| `results[].lon` | Longitude |
| `results[].elevation` | Elevation in metres (if available) |
| `results[].timezone` | IANA timezone name |
| `results[].population` | Population (if available) |

## Notes

- Use the `lat` and `lon` from a result with [Current Weather](current.md) or [Nowcast](nowcast.md).
- Returns `404` if no locations match the query.
- Returns `502` if the geocoding API is unreachable.
