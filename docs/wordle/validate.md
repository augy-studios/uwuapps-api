# Wordle Validate

Checks whether a word is a valid entry in the word list. Useful for validating guesses in a Wordle-style game.

```
GET /wordle/validate
```

Also accepts `POST` with a JSON body `{ "word": "..." }`.

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `word` | Yes | The word to validate (letters only) |

## Example

```bash
curl "https://api.uwuapps.org/wordle/validate?word=flame"
```

**POST example:**

```bash
curl -X POST "https://api.uwuapps.org/wordle/validate" \
  -H "Content-Type: application/json" \
  -d '{"word": "flame"}'
```

### Response (valid word)

```json
{
  "success": true,
  "word": "flame",
  "length": 5,
  "valid": true
}
```

### Response (not in word list)

```json
{
  "success": true,
  "word": "zxxyz",
  "length": 5,
  "valid": false
}
```

## Response fields

| Field | Description |
|---|---|
| `word` | The word checked (lowercased) |
| `length` | Length of the word |
| `valid` | `true` if the word is in the word list, `false` otherwise |

## Notes

- The lookup is case-insensitive.
- Only letters are allowed — no numbers or special characters.
- The word list is shared with [Wordle Word](word.md) and [Random Word](../random/word.md).
