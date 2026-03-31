# UEN Generate

Generates a valid Singapore Unique Entity Number (UEN).

```
GET /api/uen/generate
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `type` | No | Random | UEN type: `A`, `B`, or `C` |
| `year` | No | Random | Registration year (4 digits, for Type B/C) |
| `prefix` | No | Random | Prefix character for Type C (`T`, `S`, or `R`) |

## Example

```bash
curl "https://api.uwuapps.com/api/uen/generate?type=B&year=2020"
```

### Response

```json
{
  "success": true,
  "uen": "202012345K",
  "type": "B"
}
```

## UEN types

| Type | Description |
|---|---|
| `A` | Business registered with ACRA (9 chars: 8 digits + checksum) |
| `B` | Local company (10 chars: 4-digit year + 5 digits + checksum) |
| `C` | Other entities (10 chars: prefix + year + entity code + digits + checksum) |
