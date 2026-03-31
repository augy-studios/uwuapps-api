# Encode / Decode

Encodes or decodes text using a variety of algorithms.

```
GET /api/convert/encode
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `alg` | Yes | — | Encoding algorithm (see list below) |
| `text` | Yes | — | The text to process |
| `mode` | No | `encode` | `encode` or `decode` |

Additional algorithm-specific parameters can be passed as extra query parameters.

## Response

```json
{
  "success": true,
  "alg": "base64",
  "mode": "encode",
  "input": "Hello",
  "result": "SGVsbG8="
}
```

---

## Algorithms

### `base64`

Standard Base64 encoding.

```bash
# Encode
curl "https://api.uwuapps.com/api/convert/encode?alg=base64&text=Hello&mode=encode"

# Decode
curl "https://api.uwuapps.com/api/convert/encode?alg=base64&text=SGVsbG8%3D&mode=decode"
```

---

### `base32`

Base32 encoding using the standard alphabet (`A-Z`, `2-7`).

```bash
curl "https://api.uwuapps.com/api/convert/encode?alg=base32&text=Hello&mode=encode"
```

---

### `ascii85`

ASCII85 (Base85) encoding.

```bash
curl "https://api.uwuapps.com/api/convert/encode?alg=ascii85&text=Hello&mode=encode"
```

---

### `urlenc`

URL encoding (percent-encoding).

```bash
# Encode: "Hello World" → "Hello%20World"
curl "https://api.uwuapps.com/api/convert/encode?alg=urlenc&text=Hello+World&mode=encode"
```

---

### `codepoints`

Converts characters to Unicode code points and back.

```bash
# Encode: "Hi" → "U+0048 U+0069"
curl "https://api.uwuapps.com/api/convert/encode?alg=codepoints&text=Hi&mode=encode"
```

---

### `baudot`

Baudot/ITA2 5-bit telegraph encoding. Outputs binary groups.

```bash
curl "https://api.uwuapps.com/api/convert/encode?alg=baudot&text=HELLO&mode=encode"
```

---

### `case`

Transforms text case.

| Extra parameter | Default | Options |
|---|---|---|
| `style` | `upper` | `upper`, `lower`, `title`, `sentence` |

```bash
# Title case
curl "https://api.uwuapps.com/api/convert/encode?alg=case&text=hello+world&style=title"
```

Note: `mode` is ignored for `case` — it always transforms in the same direction.

---

### `reverse`

Reverses the characters in the text.

```bash
curl "https://api.uwuapps.com/api/convert/encode?alg=reverse&text=Hello"
```

---

### `replace`

Find-and-replace within the text.

| Extra parameter | Default | Description |
|---|---|---|
| `find` | (empty) | Substring to find |
| `repl` | (empty) | Replacement string |

```bash
curl "https://api.uwuapps.com/api/convert/encode?alg=replace&text=Hello+World&find=World&repl=API"
```

Note: `mode` is ignored for `replace`.
