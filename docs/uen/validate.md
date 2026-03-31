# UEN Validate

Validates whether a Singapore Unique Entity Number (UEN) has the correct format and checksum.

```
GET /api/uen/validate
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `uen` | Yes | The UEN string to validate |

## Example

```bash
curl "https://api.uwuapps.com/api/uen/validate?uen=201012345K"
```

### Response

```json
{
  "success": true,
  "uen": "201012345K",
  "valid": true
}
```

## UEN formats

There are three types of UEN in Singapore:

| Type | Format | Length | Example |
|---|---|---|---|
| **A** | `{8 Digits}{Checksum}` | 9 chars | `12345678A` |
| **B** | `{4-digit year}{5 Digits}{Checksum}` | 10 chars | `201012345K` |
| **C** | `{T or S or R}{2-digit year}{Entity type}{4 Digits}{Checksum}` | 10 chars | `T12LL1234A` |

### Type C entity codes

`LP`, `LL`, `FC`, `PF`, `RF`, `MQ`, `MM`, `NB`, `CC`, `CS`, `MB`, `FM`, `GS`, `GA`, `GB`, `DP`, `CP`, `NR`, `CM`, `CD`, `MD`, `HS`, `VH`, `CH`, `MH`, `CL`, `XL`, `CX`, `RP`, `TU`, `TC`, `FB`, `FN`, `PA`, `PB`, `SS`, `MC`, `SM`

## Notes

- Input is case-insensitive.
- The checksum letter is calculated from the preceding digits.
