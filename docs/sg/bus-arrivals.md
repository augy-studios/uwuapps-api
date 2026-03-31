# Bus Arrivals (Singapore)

Returns real-time bus arrival estimates for a Singapore bus stop. Powered by [BusRouter SG](https://busrouter.sg).

```
GET /api/sg/bus-arrivals
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `code` | Yes | 5-digit bus stop code (e.g. `83139`) |

## Example

```bash
curl "https://api.uwuapps.com/api/sg/bus-arrivals?code=83139"
```

### Response

```json
{
  "success": true,
  "stopCode": "83139",
  "fetchedAt": "2025-01-15T10:30:00.000Z",
  "services": [
    {
      "serviceNo": "65",
      "next": {
        "eta": "3 mins",
        "durationMs": 180000,
        "load": "SEA",
        "type": "SD",
        "feature": "WAB"
      },
      "subsequent": {
        "eta": "12 mins",
        "durationMs": 720000,
        "load": "SDA",
        "type": "SD",
        "feature": "WAB"
      },
      "subsequent2": {
        "eta": "22 mins",
        "durationMs": 1320000,
        "load": "LSD",
        "type": "DD",
        "feature": null
      }
    }
  ]
}
```

## Response fields

| Field | Description |
|---|---|
| `stopCode` | The queried bus stop code |
| `fetchedAt` | Timestamp of when the data was fetched (ISO 8601) |
| `services` | Array of bus services at this stop |
| `services[].serviceNo` | Bus service number |
| `services[].next` | Next arriving bus |
| `services[].subsequent` | Second next bus |
| `services[].subsequent2` | Third next bus |

### Bus arrival object

| Field | Description |
|---|---|
| `eta` | Human-readable estimated arrival (e.g. `3 mins`, `45s`) |
| `durationMs` | Duration in milliseconds until arrival |
| `load` | Passenger load: `SEA` (seats available), `SDA` (standing available), `LSD` (limited standing) |
| `type` | Bus type: `SD` (single-deck), `DD` (double-deck), `BD` (bendy) |
| `feature` | Special feature: `WAB` (wheelchair accessible), or `null` |

## Notes

- Bus stop codes can be found on physical bus stop signs in Singapore or via [BusRouter SG](https://busrouter.sg).
- Returns `502` if BusRouter SG is unreachable.
