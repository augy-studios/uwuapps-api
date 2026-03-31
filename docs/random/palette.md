# Color Palette

Generates a random set of harmonious colors.

```
GET /random/palette
```

## Parameters

No parameters required.

## Example

```bash
curl "https://api.uwuapps.org/random/palette"
```

### Response

```json
{
  "success": true,
  "palette": [
    { "hex": "#f3a25b", "rgb": { "r": 243, "g": 162, "b": 91 } },
    { "hex": "#7b42c8", "rgb": { "r": 123, "g": 66, "b": 200 } },
    { "hex": "#2de891", "rgb": { "r": 45, "g": 232, "b": 145 } },
    { "hex": "#e84a5f", "rgb": { "r": 232, "g": 74, "b": 95 } },
    { "hex": "#355c7d", "rgb": { "r": 53, "g": 92, "b": 125 } }
  ]
}
```

## Response fields

| Field           | Description             |
| --------------- | ----------------------- |
| `palette`       | Array of color objects  |
| `palette[].hex` | Color as a hex string   |
| `palette[].rgb` | Color as RGB components |
