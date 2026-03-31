# Hangman

Returns a random word with a hint for a Hangman (or Word Guess) game.

```
GET /random/hangman
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `game` | No | `hangman` | Game mode: `hangman` or `wordguess` |
| `exclude` | No | (none) | Comma-separated list of words to exclude (max 100) |

## Example

```bash
curl "https://api.uwuapps.org/random/hangman"
```

**Wordguess mode, excluding recently seen words:**

```bash
curl "https://api.uwuapps.org/random/hangman?game=wordguess&exclude=pizza,galaxy,robot"
```

### Response

```json
{
  "success": true,
  "word": "adventure",
  "hint": "An exciting or daring experience.",
  "maxGuesses": 8,
  "total": 80
}
```

## Response fields

| Field | Description |
|---|---|
| `word` | The word to guess |
| `hint` | A clue describing the word |
| `maxGuesses` | Number of incorrect guesses allowed |
| `total` | Total words available in the word list |

## Game modes

| `game` | `maxGuesses` |
|---|---|
| `hangman` | Always `6` (one per body part) |
| `wordguess` | `8` if word is 5+ letters, `6` if shorter |

## Exclude list

Use `exclude` to avoid showing the same word twice in a session. Pass the words the player has already seen as a comma-separated list.

```bash
curl "https://api.uwuapps.org/random/hangman?exclude=pizza,volcano,guitar"
```

## Errors

| Error | Cause |
|---|---|
| `"game" must be "hangman" or "wordguess".` | Invalid game mode provided |
| `All words have been excluded.` | Every word in the list was in the exclude list |
| `"exclude" cannot contain more than 100 words.` | Too many words in the exclude list |
