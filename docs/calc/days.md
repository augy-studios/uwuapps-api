# Days Between Dates

Calculates the number of days between two dates.

```
GET /api/calc/days
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `from` | Yes | Start date in `YYYY-MM-DD` format |
| `to` | Yes | End date in `YYYY-MM-DD` format |

## Example

```bash
curl "https://api.uwuapps.com/api/calc/days?from=2025-01-01&to=2025-12-31"
```

### Response

```json
{
  "success": true,
  "from": "2025-01-01",
  "to": "2025-12-31",
  "days": 364
}
```

## Notes

- The result is always a positive number regardless of which date is earlier.
- Both dates must be valid ISO date strings.

## Errors

| Error | Cause |
|---|---|
| `Invalid "from" date.` | `from` is not a valid date |
| `Invalid "to" date.` | `to` is not a valid date |
