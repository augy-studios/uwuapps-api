# Color Contrast Check

Calculates the WCAG contrast ratio between a text color and a background color.

```
GET /api/check/contrast
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `text` | Yes | Text (foreground) color as a hex value (e.g. `#ffffff`) |
| `bg` | Yes | Background color as a hex value (e.g. `#000000`) |

## Example

```bash
curl "https://api.uwuapps.com/api/check/contrast?text=%23ffffff&bg=%23000000"
```

### Response

```json
{
  "success": true,
  "textColor": "#ffffff",
  "bgColor": "#000000",
  "ratio": 21,
  "aa": {
    "normal": true,
    "large": true
  },
  "aaa": {
    "normal": true,
    "large": true
  }
}
```

## Response fields

| Field | Description |
|---|---|
| `ratio` | WCAG contrast ratio (1:1 to 21:1) |
| `aa.normal` | Passes WCAG AA for normal text (ratio ≥ 4.5) |
| `aa.large` | Passes WCAG AA for large text (ratio ≥ 3.0) |
| `aaa.normal` | Passes WCAG AAA for normal text (ratio ≥ 7.0) |
| `aaa.large` | Passes WCAG AAA for large text (ratio ≥ 4.5) |

## WCAG thresholds

| Level | Normal text | Large text |
|---|---|---|
| AA | 4.5:1 | 3.0:1 |
| AAA | 7.0:1 | 4.5:1 |

**Large text** is defined as 18pt (24px) or 14pt bold (approximately 18.67px bold).

## Notes

- Colors must be hex format: `#rgb`, `#rrggbb`, or without the `#` prefix.
- The ratio is the same regardless of which color is text or background.
