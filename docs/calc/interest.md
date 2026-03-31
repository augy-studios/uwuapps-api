# Simple Interest

Calculates simple interest and the total amount.

```
GET /calc/interest
```

## Parameters

| Parameter   | Required | Default | Description                                            |
| ----------- | -------- | ------- | ------------------------------------------------------ |
| `principal` | Yes      | —       | Principal amount (e.g. `1000`)                         |
| `rate`      | Yes      | —       | Annual interest rate as a percentage (e.g. `5` for 5%) |
| `time`      | Yes      | —       | Time period (number of years or months)                |
| `duration`  | No       | `year`  | Time unit: `year` or `month`                           |

## Example

**Annual rate for 3 years:**

```bash
curl "https://api.uwuapps.org/calc/interest?principal=1000&rate=5&time=3&duration=year"
```

**Monthly rate for 12 months:**

```bash
curl "https://api.uwuapps.org/calc/interest?principal=1000&rate=5&time=12&duration=month"
```

### Response

```json
{
  "success": true,
  "principal": 1000,
  "rate": 5,
  "time": 3,
  "duration": "year",
  "interest": 150,
  "amount": 1150
}
```

## Response fields

| Field       | Description                         |
| ----------- | ----------------------------------- |
| `principal` | The principal amount                |
| `rate`      | The interest rate                   |
| `time`      | The time period                     |
| `duration`  | The time unit (`year` or `month`)   |
| `interest`  | The calculated interest             |
| `amount`    | Principal + interest (total amount) |

## Formula

* **Yearly:** `Interest = (principal × rate × time) / 100`
* **Monthly:** `Interest = (principal × rate × time) / 1200`
