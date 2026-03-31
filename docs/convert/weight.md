# Weight

Converts a weight value between kilograms, pounds, and ounces.

```
GET /convert/weight
```

## Parameters

| Parameter | Required | Description                      |
| --------- | -------- | -------------------------------- |
| `value`   | Yes      | Numeric weight value to convert  |
| `from`    | Yes      | Source unit: `kg`, `lb`, or `oz` |
| `to`      | Yes      | Target unit: `kg`, `lb`, or `oz` |

## Units

| Code | Unit      |
| ---- | --------- |
| `kg` | Kilograms |
| `lb` | Pounds    |
| `oz` | Ounces    |

## Example

```bash
curl "https://api.uwuapps.org/convert/weight?value=1&from=kg&to=lb"
```

### Response

```json
{
  "success": true,
  "value": 1,
  "from": "kg",
  "to": "lb",
  "result": 2.2046
}
```

The `result` is rounded to 4 decimal places.
