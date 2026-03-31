# NRIC Reconstruct

Reconstructs possible NRIC numbers from partial known information. Useful for forensic or administrative recovery scenarios.

```
GET /api/nric/reconstruct
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `last` | Yes | The last N characters of the NRIC (trailing digits + checksum letter), e.g. `567D` |
| `year` | Yes | 4-digit year of birth, e.g. `1990` |
| `citizenship` | Yes | Citizenship status: `S` (Singaporean), `P` (Permanent Resident), or `F` (Foreigner) |
| `born_sg` | Yes | Whether born in Singapore: `Y` or `N` |
| `month` | No | 3-letter birth month (e.g. `Jan`, `Feb`). Narrows results using SingStat birth data (Singapore-born citizens/PRs only) |

## Example

```bash
curl "https://api.uwuapps.com/api/nric/reconstruct?last=567D&year=1990&citizenship=S&born_sg=Y"
```

### Response

```json
{
  "count": 3,
  "truncated": false,
  "nrics": [
    "S9012567D",
    "S9034567D",
    "S9056567D"
  ]
}
```

## Response fields

| Field | Description |
|---|---|
| `count` | Total number of matching NRICs found |
| `truncated` | `true` if the result was capped at 1000 entries |
| `nrics` | Array of valid matching NRIC strings (max 1000) |

## How it works

1. The prefix (`S`, `T`, `F`, or `G`) is determined from `citizenship` and `year`.
2. The first 2 digits of the NRIC body are derived from the last 2 digits of `year`.
3. The 3rd digit indicates birth location: `0–5` for Singapore-born, `5–9` for foreign-born.
4. All valid combinations of the remaining unknown digits are tried.
5. Only combinations that produce a valid NRIC checksum are returned.
6. If `month` is provided, results are further filtered using SingStat birth registration data.

## Notes

- A minimum of 1 character (the checksum letter) must be provided in `last`.
- Results are capped at 1000 to prevent excessively large payloads.
- The `month` filter is best-effort; if SingStat's API is unreachable, it is skipped and all matches are returned.
