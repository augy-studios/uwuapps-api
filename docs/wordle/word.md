# Wordle Word

Returns a random word for use in a Wordle-style game. Defaults to 5-letter words.

```
GET /wordle/word
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `length` | No | `5` | Word length (1–50) |

## Example

```bash
curl "https://api.uwuapps.org/wordle/word"
```

**With a specific length:**

```bash
curl "https://api.uwuapps.org/wordle/word?length=5"
```

### Response

```json
{
  "success": true,
  "word": "flame",
  "length": 5
}
```

## Notes

- Words are pulled from the shared word list (`public/wordlist.json`).
- Returns `404` if no words of the requested length are available.
- To validate a guess, see [Wordle Validate](validate.md).
