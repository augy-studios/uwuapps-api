# Cipher

Encodes or decodes text using a variety of classical ciphers and encoding schemes.

```
GET /api/convert/cipher
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `alg` | Yes | — | Cipher algorithm (see list below) |
| `text` | Yes | — | The text to encode or decode |
| `mode` | No | `encode` | `encode` or `decode` |

Additional algorithm-specific parameters can be appended as extra query parameters (see per-algorithm options below).

## Response

```json
{
  "success": true,
  "alg": "caesar",
  "mode": "encode",
  "input": "HELLO",
  "result": "KHOOR"
}
```

---

## Algorithms

### `caesar` — Caesar Cipher

Shifts each letter by a fixed number of positions.

| Extra parameter | Default | Description |
|---|---|---|
| `shift` | `3` | Number of positions to shift |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=caesar&text=HELLO&shift=3"
```

---

### `rot13` — ROT13

A special case of Caesar cipher with a shift of 13. Encoding and decoding are the same operation.

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=rot13&text=HELLO"
```

---

### `a1z26` — A1Z26

Encodes letters as numbers (A=1, B=2, ..., Z=26), separated by dashes.

```bash
# Encode: "HELLO" → "8-5-12-12-15"
curl "https://api.uwuapps.com/api/convert/cipher?alg=a1z26&text=HELLO&mode=encode"

# Decode: "8-5-12-12-15" → "HELLO"
curl "https://api.uwuapps.com/api/convert/cipher?alg=a1z26&text=8-5-12-12-15&mode=decode"
```

---

### `vigenere` — Vigenère Cipher

A polyalphabetic substitution cipher using a keyword.

| Extra parameter | Default | Description |
|---|---|---|
| `key` | `KEY` | The keyword for encoding/decoding |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=vigenere&text=HELLO&key=SECRET"
```

---

### `affine` — Affine Cipher

Encodes letters using the formula `(a*x + b) mod 26`. The value of `a` must be coprime to 26.

| Extra parameter | Default | Description |
|---|---|---|
| `a` | `5` | Multiplicative key (must be coprime to 26) |
| `b` | `8` | Additive key |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=affine&text=HELLO&a=5&b=8"
```

Valid values for `a`: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.

---

### `bacon` — Bacon's Cipher

Encodes letters as 5-character sequences of `A` and `B`.

```bash
# Encode: "HELLO" → "AABBB AABAA ABABB ABABB ABBBA"
curl "https://api.uwuapps.com/api/convert/cipher?alg=bacon&text=HELLO&mode=encode"
```

---

### `railfence` — Rail Fence Cipher

A transposition cipher that arranges characters in a zigzag pattern.

| Extra parameter | Default | Description |
|---|---|---|
| `rails` | `3` | Number of rails (2–20) |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=railfence&text=HELLO&rails=3"
```

---

### `submono` — Monoalphabetic Substitution

Each letter is mapped to another using a 26-character substitution alphabet.

| Extra parameter | Required | Description |
|---|---|---|
| `map` | Yes | A 26-letter string defining the substitution (e.g. `ZYXWVUTSRQPONMLKJIHGFEDCBA` for Atbash) |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=submono&text=HELLO&map=ZYXWVUTSRQPONMLKJIHGFEDCBA"
```

---

### `polybius` — Polybius Square

Encodes letters as coordinates in a 5×5 grid.

| Extra parameter | Default | Description |
|---|---|---|
| `keyword` | (none) | Optional keyword to rearrange the square |
| `coords` | `numbers` | Output format: `numbers` (e.g. `11`) or `letters` (e.g. `AA`) |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=polybius&text=HELLO"
```

---

### `tap` — Tap Code

Encodes letters using a 5×5 grid tapped out in rows and columns (using dots).

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=tap&text=HELLO&mode=encode"
```

---

### `nato` — NATO Phonetic Alphabet

Converts letters and digits to their NATO phonetic equivalents.

```bash
# Encode: "SOS" → "Sierra Oscar Sierra"
curl "https://api.uwuapps.com/api/convert/cipher?alg=nato&text=SOS&mode=encode"
```

---

### `adfgx` — ADFGX Cipher

A WWI German field cipher combining a Polybius square with columnar transposition.

| Extra parameter | Description |
|---|---|
| `keyword` | Polybius square keyword |
| `trans` | Columnar transposition key |

---

### `adfgvx` — ADFGVX Cipher

An extension of ADFGX that also handles digits.

| Extra parameter | Description |
|---|---|
| `keyword` | Square keyword |
| `trans` | Transposition key |

---

### `bifid` — Bifid Cipher

Combines a Polybius square with fractional encryption.

| Extra parameter | Default | Description |
|---|---|---|
| `keyword` | (none) | Optional keyword to rearrange the square |

---

### `trifid` — Trifid Cipher

A 3D extension of the Bifid cipher using a 27-symbol alphabet.

| Extra parameter | Default | Description |
|---|---|---|
| `alphabet` | `ABCDEFGHIJKLMNOPQRSTUVWXYZ.` | A 27-character string |

---

### `nihilist` — Nihilist Cipher

Combines a Polybius square with a numeric key.

| Extra parameter | Required | Description |
|---|---|---|
| `keyword` | No | Polybius keyword |
| `numkey` | Yes | Numeric key (digits only, e.g. `1234`) |

---

### `enigma` — Enigma Machine

A simulation of the WWII Enigma machine.

| Extra parameter | Default | Description |
|---|---|---|
| `rotors` | `I-II-III` | Rotor selection (e.g. `I-II-III`, `IV-V-I`) |
| `rings` | `01-01-01` | Ring settings (e.g. `01-01-01`) |
| `pos` | `A-A-A` | Starting rotor positions (e.g. `A-A-A`) |
| `plug` | (none) | Plugboard pairs (letters, e.g. `ABCD` for A↔B and C↔D) |

```bash
curl "https://api.uwuapps.com/api/convert/cipher?alg=enigma&text=HELLO&rotors=I-II-III&pos=A-A-A"
```

The Enigma machine is symmetric — encoding and decoding use the same settings.
