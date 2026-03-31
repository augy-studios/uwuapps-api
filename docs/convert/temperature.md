# Temperature

Converts a temperature value between Celsius, Fahrenheit, and Kelvin.

```
GET /convert/temperature
```

## Parameters

| Parameter | Required | Description                          |
| --------- | -------- | ------------------------------------ |
| `value`   | Yes      | Numeric temperature value to convert |
| `from`    | Yes      | Source unit: `c`, `f`, or `k`        |
| `to`      | Yes      | Target unit: `c`, `f`, or `k`        |

## Units

| Code | Unit       |
| ---- | ---------- |
| `c`  | Celsius    |
| `f`  | Fahrenheit |
| `k`  | Kelvin     |

## Example

```bash
curl "https://api.uwuapps.org/convert/temperature?value=100&from=c&to=f"
```

### Response

```json
{
  "success": true,
  "value": 100,
  "from": "c",
  "to": "f",
  "result": 212
}
```

The `result` is rounded to 4 decimal places.
