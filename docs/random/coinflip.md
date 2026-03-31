# Coin Flip

Flips a virtual coin and returns heads or tails.

```
GET /api/random/coinflip
```

## Parameters

No parameters required.

## Example

```bash
curl "https://api.uwuapps.com/api/random/coinflip"
```

### Response

```json
{
  "success": true,
  "result": "heads"
}
```

## Response fields

| Field | Values |
|---|---|
| `result` | `heads` or `tails` |
