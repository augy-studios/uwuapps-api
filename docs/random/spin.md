# Spin the Wheel

Simulates spinning a wheel and returns the landed segment.

```
GET /random/spin
```

## Parameters

| Parameter  | Required | Default       | Description                                          |
| ---------- | -------- | ------------- | ---------------------------------------------------- |
| `segments` | No       | `1,2,3,4,5,6` | Comma-separated list of segment labels (2–100 items) |

## Example

```bash
curl "https://api.uwuapps.org/random/spin?segments=Pizza,Sushi,Burger,Tacos"
```

### Response

```json
{
  "success": true,
  "degree": 237,
  "result": "Burger",
  "segmentIndex": 2,
  "segments": ["Pizza", "Sushi", "Burger", "Tacos"]
}
```

## Response fields

| Field          | Description                                    |
| -------------- | ---------------------------------------------- |
| `degree`       | The random degree the wheel stopped at (0–359) |
| `result`       | The segment label the wheel landed on          |
| `segmentIndex` | Zero-based index of the winning segment        |
| `segments`     | The full list of segments used                 |

## Notes

* The wheel is divided evenly between all segments.
* At least 2 segments are required; maximum is 100.
