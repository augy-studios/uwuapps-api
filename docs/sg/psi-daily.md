# PSI Daily

Returns daily PSI readings for Singapore from [data.gov.sg](https://data.gov.sg).

```
GET /sg/psi-daily
```

## Parameters

| Parameter | Required | Default | Description                                   |
| --------- | -------- | ------- | --------------------------------------------- |
| `date`    | No       | Latest  | Specific date to query in `YYYY-MM-DD` format |

## Example

```bash
curl "https://api.uwuapps.org/sg/psi-daily?date=2025-01-15"
```

### Response

```json
{
  "success": true,
  "date": "2025-01-15",
  "readings": [
    {
      "timestamp": "2025-01-15T01:00:00+08:00",
      "national": 45,
      "west": 42,
      "east": 48,
      "central": 45,
      "south": 44,
      "north": 43
    }
  ]
}
```

## Notes

* Returns all available readings for the specified date.
* Returns `404` if no readings are available for the given date.
* Returns `502` if data.gov.sg is unreachable.
