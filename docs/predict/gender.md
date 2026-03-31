# Predict Gender

Predicts the likely gender of a person based on their first name, using the [Genderize.io](https://genderize.io) API.

```
GET /api/predict/gender
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `name` | Yes | The first name to analyze |

## Example

```bash
curl "https://api.uwuapps.com/api/predict/gender?name=Alex"
```

### Response

```json
{
  "success": true,
  "name": "Alex",
  "gender": "male",
  "probability": 0.73,
  "count": 12500
}
```

## Response fields

| Field | Description |
|---|---|
| `name` | The name queried |
| `gender` | Predicted gender: `male`, `female`, or `null` if unknown |
| `probability` | Confidence from 0 to 1 |
| `count` | Number of data samples used for the prediction |

## Notes

- Predictions are based on statistical data from Genderize.io.
- A `null` gender means the name was not found in the dataset.
- Predictions may not be accurate for all names, especially less common ones.
