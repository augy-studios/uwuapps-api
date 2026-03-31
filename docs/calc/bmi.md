# BMI Calculator

Calculates Body Mass Index (BMI) and returns the weight category.

```
GET /api/calc/bmi
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `height` | Yes | — | Height value |
| `weight` | Yes | — | Weight value |
| `unit` | No | `metric` | `metric` (cm / kg) or `imperial` (inches / lbs) |

## Example

**Metric:**

```bash
curl "https://api.uwuapps.com/api/calc/bmi?height=170&weight=65&unit=metric"
```

**Imperial:**

```bash
curl "https://api.uwuapps.com/api/calc/bmi?height=67&weight=143&unit=imperial"
```

### Response

```json
{
  "success": true,
  "bmi": 22.5,
  "category": "Normal",
  "unit": "metric",
  "height": 170,
  "weight": 65
}
```

## Response fields

| Field | Description |
|---|---|
| `bmi` | Calculated BMI, rounded to 1 decimal place |
| `category` | One of: `Underweight`, `Normal`, `Overweight`, `Obese` |
| `unit` | The unit system used |
| `height` | Height value as provided |
| `weight` | Weight value as provided |

## BMI categories

| Range | Category |
|---|---|
| < 18.5 | Underweight |
| 18.5 – 24.9 | Normal |
| 25 – 29.9 | Overweight |
| ≥ 30 | Obese |

## Units

| `unit` | `height` | `weight` |
|---|---|---|
| `metric` | Centimetres (cm) | Kilograms (kg) |
| `imperial` | Inches (in) | Pounds (lbs) |
