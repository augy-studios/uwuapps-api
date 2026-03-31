# Validate

Validates whether a Singapore NRIC/FIN number has the correct format and checksum.

```
GET /nric/validate
```

## Parameters

| Parameter | Required | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `nric`    | Yes      | The NRIC/FIN string to validate (e.g. `S1234567D`) |

## Example

```bash
curl "https://api.uwuapps.org/nric/validate?nric=S1234567D"
```

### Response

```json
{
  "success": true,
  "nric": "S1234567D",
  "valid": true
}
```

## NRIC format

Singapore NRICs follow the format: **`{Prefix}{7 Digits}{Checksum}`**

| Component | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| Prefix    | `S` — Singapore citizen born before 2000                              |
|           | `T` — Singapore citizen born in 2000 or later                         |
|           | `F` — Foreigner with PR issued before 2000                            |
|           | `G` — Foreigner with PR issued in 2000 or later                       |
| 7 Digits  | Sequential identification number                                      |
| Checksum  | A single letter calculated from the digits using a weighted algorithm |

## Notes

* Validation checks both the format and the checksum letter.
* Input is case-insensitive.
