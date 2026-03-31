# Aspect Ratio Calculator

Calculates dimensions that conform to a given aspect ratio.

```
GET /api/calc/aspect
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `ratioW` | Yes | Ratio width component (e.g. `16`) |
| `ratioH` | Yes | Ratio height component (e.g. `9`) |
| `width` | No | Known width — calculates the corresponding height |
| `height` | No | Known height — calculates the corresponding width |

Provide either `width` or `height` (or both) to get the calculated counterpart. If neither is provided, the response returns only the simplified ratio.

## Example

**Calculate height from width:**

```bash
curl "https://api.uwuapps.com/api/calc/aspect?ratioW=16&ratioH=9&width=1920"
```

**Calculate width from height:**

```bash
curl "https://api.uwuapps.com/api/calc/aspect?ratioW=16&ratioH=9&height=1080"
```

### Response

```json
{
  "success": true,
  "ratio": "16:9",
  "width": 1920,
  "height": 1080
}
```

## Errors

| Error | Cause |
|---|---|
| `Query parameter "ratioW" is required` | `ratioW` was not provided |
| `Query parameter "ratioH" is required` | `ratioH` was not provided |
| `"width" must be a number.` | `width` is not numeric |
| `"height" must be a number.` | `height` is not numeric |
