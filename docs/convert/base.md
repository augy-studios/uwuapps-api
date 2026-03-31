# Number Base Conversion

Converts a number between binary, octal, decimal, and hexadecimal.

```
GET /api/convert/base
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `value` | Yes | The number to convert (as a string, e.g. `FF`, `1010`, `255`) |
| `from` | Yes | Source base: `bin`, `oct`, `dec`, or `hex` |
| `to` | Yes | Target base: `bin`, `oct`, `dec`, or `hex` |

## Bases

| Code | Base | Description |
|---|---|---|
| `bin` | 2 | Binary |
| `oct` | 8 | Octal |
| `dec` | 10 | Decimal |
| `hex` | 16 | Hexadecimal |

## Example

```bash
curl "https://api.uwuapps.com/api/convert/base?value=255&from=dec&to=hex"
```

### Response

```json
{
  "success": true,
  "value": "255",
  "from": "dec",
  "to": "hex",
  "decimal": 255,
  "result": "FF"
}
```

## Notes

- Hexadecimal output is always uppercase (e.g. `FF`, not `ff`).
- Optional prefixes (`0x`, `0b`, `0o`) are stripped automatically.
- The `decimal` field always shows the intermediate decimal representation.
