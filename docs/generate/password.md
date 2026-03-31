# Password

Generates a random password with configurable character sets.

```
GET /generate/password
```

## Parameters

| Parameter   | Required | Default | Description                  |
| ----------- | -------- | ------- | ---------------------------- |
| `length`    | No       | `16`    | Password length (1–128)      |
| `numbers`   | No       | `true`  | Include digits (`0-9`)       |
| `uppercase` | No       | `true`  | Include uppercase letters    |
| `symbols`   | No       | `false` | Include symbols (\`^!$%&     |
| `spaces`    | No       | `false` | Include spaces               |
| `excDupe`   | No       | `false` | Exclude duplicate characters |

Boolean parameters accept `true` or `false` as strings.

## Example

```bash
curl "https://api.uwuapps.org/generate/password?length=20&symbols=true"
```

### Response

```json
{
  "success": true,
  "password": "aB3!xZq@pL9#mK5$rT2^",
  "length": 20,
  "strength": "strong"
}
```

## Strength levels

| Password length | Strength |
| --------------- | -------- |
| 1–7             | `weak`   |
| 8–15            | `medium` |
| 16+             | `strong` |

## Notes

* At least one character set must be enabled (lowercase is always included).
* When `excDupe` is `true`, the requested `length` cannot exceed the number of unique characters in the pool.
