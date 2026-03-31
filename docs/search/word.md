# Word Definition

Looks up the definition(s) of a word. Powered by the [Free Dictionary API](https://dictionaryapi.dev).

```
GET /api/search/word
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `word` | Yes | The word to look up |

## Example

```bash
curl "https://api.uwuapps.com/api/search/word?word=serendipity"
```

### Response

```json
{
  "success": true,
  "word": "serendipity",
  "phonetic": "/ˌsɛɹənˈdɪpɪti/",
  "meanings": [
    {
      "partOfSpeech": "noun",
      "definitions": [
        {
          "definition": "An unsought, unintended, and/or unexpected discovery...",
          "example": "Many scientific discoveries are the result of serendipity."
        }
      ]
    }
  ]
}
```

## Notes

- Returns `404` if the word is not found in the dictionary.
- Returns `502` if the dictionary API is unreachable.
