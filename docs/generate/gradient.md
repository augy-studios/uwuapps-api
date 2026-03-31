# Gradient

Generates a set of random gradient color stops.

```
GET /generate/gradient
```

## Parameters

| Parameter | Required | Default | Description                       |
| --------- | -------- | ------- | --------------------------------- |
| `count`   | No       | `2`     | Number of color stops to generate |

## Example

```bash
curl "https://api.uwuapps.org/generate/gradient?count=3"
```

### Response

```json
{
  "success": true,
  "colors": ["#f3a25b", "#7b42c8", "#2de891"],
  "gradient": "linear-gradient(135deg, #f3a25b, #7b42c8, #2de891)"
}
```

## Response fields

| Field      | Description                               |
| ---------- | ----------------------------------------- |
| `colors`   | Array of hex color strings                |
| `gradient` | Ready-to-use CSS `linear-gradient` string |

## Notes

* Colors are randomly generated on each request.
* The `gradient` value can be used directly in a CSS `background` property.
