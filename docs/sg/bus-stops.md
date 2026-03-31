# Bus Stops

Returns a list of all bus stops in Singapore.

```
GET /sg/bus-stops
```

## Parameters

No parameters required.

## Example

```bash
curl "https://api.uwuapps.org/sg/bus-stops"
```

### Response

```json
{
  "success": true,
  "count": 5000,
  "stops": [
    {
      "code": "01012",
      "name": "Hotel Grand Pacific",
      "road": "Victoria St",
      "lat": 1.29684825487647,
      "lng": 103.85253591654006
    }
  ]
}
```

## Response fields

| Field          | Description                        |
| -------------- | ---------------------------------- |
| `count`        | Total number of bus stops returned |
| `stops`        | Array of bus stop objects          |
| `stops[].code` | 5-digit bus stop code              |
| `stops[].name` | Bus stop name                      |
| `stops[].road` | Road name                          |
| `stops[].lat`  | Latitude                           |
| `stops[].lng`  | Longitude                          |

## Notes

* This returns the full list of all Singapore bus stops — the response can be large.
* Returns `502` if the upstream data source is unreachable.
