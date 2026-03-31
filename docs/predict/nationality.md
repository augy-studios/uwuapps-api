# Nationality

Predicts the likely nationality of a person based on their first name, using the [Nationalize.io](https://nationalize.io) API.

```
GET /predict/nationality
```

## Parameters

| Parameter | Required | Description               |
| --------- | -------- | ------------------------- |
| `name`    | Yes      | The first name to analyze |

## Example

```bash
curl "https://api.uwuapps.org/predict/nationality?name=Wei"
```

### Response

```json
{
  "success": true,
  "name": "Wei",
  "country": [
    { "country_id": "CN", "probability": 0.85 },
    { "country_id": "TW", "probability": 0.07 },
    { "country_id": "SG", "probability": 0.03 }
  ]
}
```

## Response fields

| Field                   | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `name`                  | The name queried                                       |
| `country`               | Array of predicted nationalities sorted by probability |
| `country[].country_id`  | ISO 3166-1 alpha-2 country code                        |
| `country[].probability` | Confidence from 0 to 1                                 |

## Notes

* Multiple nationalities may be returned, ordered from most to least likely.
* An empty `country` array means the name was not found in the dataset.
