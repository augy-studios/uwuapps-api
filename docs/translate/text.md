# Translate Text

Translates text from one language to another. Uses [LibreTranslate](https://libretranslate.com) with [MyMemory](https://mymemory.translated.net) as a fallback.

```
GET /translate/text
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `text` | Yes | — | The text to translate |
| `to` | Yes | — | Target language code (e.g. `fr`, `zh-CN`, `es`) |
| `from` | No | `auto` | Source language code. Use `auto` to detect automatically |

## Example

**Auto-detect source language:**

```bash
curl "https://api.uwuapps.org/translate/text?text=Hello+World&to=fr"
```

**Explicit source language:**

```bash
curl "https://api.uwuapps.org/translate/text?text=Hello+World&from=en&to=zh-CN"
```

### Response

```json
{
  "success": true,
  "from": "en",
  "to": "fr",
  "original": "Hello World",
  "translated": "Bonjour le monde",
  "engine": "LibreTranslate (translate.argosopentech.com)"
}
```

## Response fields

| Field | Description |
|---|---|
| `from` | Source language code (detected or as provided) |
| `to` | Target language code |
| `original` | The original text |
| `translated` | The translated text |
| `engine` | The translation engine used |

## Common language codes

| Code | Language |
|---|---|
| `en` | English |
| `fr` | French |
| `de` | German |
| `es` | Spanish |
| `zh` | Chinese (Simplified) |
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |
| `ja` | Japanese |
| `ko` | Korean |
| `ar` | Arabic |
| `ru` | Russian |
| `ms` | Malay |
| `id` | Indonesian |
| `th` | Thai |
| `vi` | Vietnamese |

## Notes

- If `from` and `to` are the same language, the original text is returned immediately with `engine: "none (same language)"`.
- Multiple LibreTranslate instances are tried automatically. If all fail, MyMemory is used as a fallback.
- Returns `502` if all translation engines are unavailable.
