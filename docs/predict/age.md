# Predict Age

Predicts the likely age of a person based on their first name, using the [Agify.io](https://agify.io) API.

```
GET /api/predict/age
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `name` | Yes | The first name to analyze |

## Example

```bash
curl "https://api.uwuapps.com/api/predict/age?name=Michael"
```

### Response

```json
{
  "success": true,
  "name": "Michael",
  "age": 52,
  "count": 233482
}
```

## Response fields

| Field | Description |
|---|---|
| `name` | The name queried |
| `age` | Predicted age in years, or `null` if unknown |
| `count` | Number of data samples used for the prediction |

## Notes

- Predictions are based on statistical data from Agify.io.
- A `null` age means the name was not found in the dataset.
