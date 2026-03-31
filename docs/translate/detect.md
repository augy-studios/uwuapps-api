# Detect Language

Detects the language of a given text. Powered by [LibreTranslate](https://libretranslate.com) with a heuristic fallback.

```
GET /translate/detect
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `text` | Yes | The text to analyse |

## Example

```bash
curl "https://api.uwuapps.org/translate/detect?text=Bonjour+le+monde"
```

### Response

```json
{
  "success": true,
  "text": "Bonjour le monde",
  "language": "fr",
  "confidence": 0.92,
  "engine": "LibreTranslate (translate.argosopentech.com)"
}
```

## Response fields

| Field | Description |
|---|---|
| `text` | The text that was analysed |
| `language` | Detected language code (e.g. `en`, `fr`, `zh`) |
| `confidence` | Detection confidence from 0 to 1, or `null` if using heuristic fallback |
| `engine` | The engine that performed the detection |

## Engines

Detection is attempted via LibreTranslate (multiple public instances). If all instances are unavailable, a local heuristic fallback detects:

| Script | Language code |
|---|---|
| Hiragana / Katakana | `ja` |
| CJK Unified Ideographs | `zh` |
| Hangul | `ko` |
| Cyrillic | `ru` |
| Hebrew | `he` |
| Arabic | `ar` |
| (default) | `en` |

The heuristic fallback returns `null` for `confidence`.
