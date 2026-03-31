# NRIC Generate

Generates one or more valid Singapore NRIC/FIN numbers.

```
GET /api/nric/generate
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `prefix` | No | Random | NRIC prefix: `S`, `T`, `F`, or `G` |
| `count` | No | `1` | Number of NRICs to generate (1–100) |

## Prefix guide

| Prefix | Meaning |
|---|---|
| `S` | Singapore citizen, born before 2000 |
| `T` | Singapore citizen, born in 2000 or later |
| `F` | Foreigner/PR, issued before 2000 |
| `G` | Foreigner/PR, issued in 2000 or later |

## Example

```bash
curl "https://api.uwuapps.com/api/nric/generate?prefix=S&count=5"
```

### Response

```json
{
  "nrics": [
    "S1234567D",
    "S9876543C",
    "S5551234A",
    "S3214568B",
    "S1111111Z"
  ]
}
```

## Notes

- All generated NRICs have valid checksums.
- The digits are randomly generated and do not correspond to any real person.
- If `prefix` is omitted, a random prefix is chosen for each NRIC.

## Errors

| Error | Cause |
|---|---|
| `Invalid prefix. Must be S, T, F, or G.` | An unsupported prefix was provided |
