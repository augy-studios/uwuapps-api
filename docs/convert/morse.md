# Morse Code

Converts text to Morse code or Morse code back to text. Direction is auto-detected.

```
GET /convert/morse
```

## Parameters

| Parameter | Required | Description                                |
| --------- | -------- | ------------------------------------------ |
| `text`    | Yes      | Text to convert (plain text or Morse code) |

## Auto-detection

The API automatically detects the direction:

* **Text → Morse:** Input is plain text (e.g. `HELLO`)
* **Morse → Text:** Input contains dots (`.`), dashes (`-`), and slashes (`/`)

## Example: text to Morse

```bash
curl "https://api.uwuapps.org/convert/morse?text=HELLO"
```

### Response

```json
{
  "success": true,
  "direction": "text_to_morse",
  "input": "HELLO",
  "result": ".... . .-.. .-.. ---"
}
```

## Example: Morse to text

```bash
curl "https://api.uwuapps.org/convert/morse?text=.... . .-.. .-.. ---"
```

### Response

```json
{
  "success": true,
  "direction": "morse_to_text",
  "input": ".... . .-.. .-.. ---",
  "result": "HELLO"
}
```

## Morse code format

* Letters are separated by **spaces**
* Words are separated by **`/`** (space-slash-space)

For example, `HELLO WORLD` → `.... . .-.. .-.. --- / .-- --- .-. .-.. -..`
