# Password Strength Check

Validates a password and returns its strength rating.

```
GET /api/check/password
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `password` | Yes | The password to check |

## Example

```bash
curl "https://api.uwuapps.com/api/check/password?password=MyP%40ssw0rd"
```

### Response

```json
{
  "success": true,
  "password": "MyP@ssw0rd",
  "strength": "strong",
  "score": 5,
  "checks": {
    "minLength": true,
    "hasNumber": true,
    "hasLowercase": true,
    "hasUppercase": true,
    "hasSpecial": true
  }
}
```

## Strength levels

| Score | Strength |
|---|---|
| 0–2 | `weak` |
| 3 | `fair` |
| 4 | `good` |
| 5 | `strong` |

## Checks

| Check | Requirement |
|---|---|
| `minLength` | At least 8 characters |
| `hasNumber` | Contains at least one digit (`0-9`) |
| `hasLowercase` | Contains at least one lowercase letter |
| `hasUppercase` | Contains at least one uppercase letter |
| `hasSpecial` | Contains at least one special character |
