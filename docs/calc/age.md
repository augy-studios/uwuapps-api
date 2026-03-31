# Age Calculator

Calculates the exact age in years, months, and days between a birth date and a reference date.

```
GET /api/calc/age
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `date` | Yes | Birth date in `YYYY-MM-DD` format (e.g. `2000-01-15`) |
| `ref` | No | Reference date in `YYYY-MM-DD` format. Defaults to today |

## Example

```bash
curl "https://api.uwuapps.com/api/calc/age?date=2000-01-15&ref=2025-01-15"
```

### Response

```json
{
  "success": true,
  "birthDate": "2000-01-15",
  "referenceDate": "2025-01-15",
  "years": 25,
  "months": 0,
  "days": 0
}
```

## Response fields

| Field | Description |
|---|---|
| `birthDate` | The birth date provided |
| `referenceDate` | The reference date used |
| `years` | Complete years of age |
| `months` | Remaining months after full years |
| `days` | Remaining days after full months |

## Errors

| Error | Cause |
|---|---|
| `Query parameter "date" is required` | `date` was not provided |
| `Invalid birth date.` | `date` is not a valid date string |
| `Invalid reference date.` | `ref` is not a valid date string |
| `Birth date is in the future.` | `date` is after the reference date |
