# CAPTCHA

A simple CAPTCHA system using HMAC-signed tokens. Tokens expire after 5 minutes.

## Flow

1. Call `/api/captcha/generate` to get a CAPTCHA challenge and a signed token.
2. Display the `captcha` string to the user.
3. Submit the user's input along with the `token` to `/api/captcha/verify`.

---

## Generate

```
GET /api/captcha/generate
```

No parameters required.

### Response

```json
{
  "success": true,
  "captcha": "aB3xZq",
  "token": "1700000000000.abc123def456...",
  "expiresIn": 300
}
```

| Field | Description |
|---|---|
| `captcha` | The challenge string to display to the user |
| `token` | Signed token to send back with the verification request |
| `expiresIn` | Seconds until the token expires (always `300` / 5 minutes) |

---

## Verify

```
GET /api/captcha/verify
```

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `input` | Yes | The user's answer to the CAPTCHA challenge |
| `token` | Yes | The `token` returned from `/api/captcha/generate` |

### Response (valid)

```json
{
  "success": true,
  "valid": true
}
```

### Response (invalid / expired)

```json
{
  "success": false,
  "error": "Invalid or expired CAPTCHA."
}
```

### Notes

- Verification is **case-insensitive**.
- Tokens are verified using `crypto.timingSafeEqual` to prevent timing attacks.
- Once a token expires (after 5 minutes), it cannot be used again — request a new one.
