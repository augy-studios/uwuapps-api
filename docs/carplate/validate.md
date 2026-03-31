# Validate

Validates whether a Singapore vehicle registration plate has a valid format and checksum.

```
GET /carplate/validate
```

## Parameters

| Parameter | Required | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `plate`   | Yes      | The car plate string to validate (e.g. `SHA1234B`) |

## Example

```bash
curl "https://api.uwuapps.org/carplate/validate?plate=SHA1234B"
```

### Response

```json
{
  "success": true,
  "plate": "SHA1234B",
  "valid": true
}
```

## Car plate format

Singapore plates follow the format: **`{Prefix}{Digits}{Checksum}`**

| Component | Description                                           |
| --------- | ----------------------------------------------------- |
| Prefix    | 1–3 letters indicating the vehicle series             |
| Digits    | 1–4 digits (padded with leading zeros internally)     |
| Checksum  | A single letter calculated from the prefix and digits |

Examples: `SHA1234B`, `SJD999Z`, `E123A`

## Notes

* Input is case-insensitive.
* The checksum letter is validated using a weighted algorithm.
