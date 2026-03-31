# Hangman

Returns a random word for a Hangman game, with optional difficulty filtering.

```
GET /random/hangman
```

## Parameters

| Parameter    | Required | Default  | Description                                  |
| ------------ | -------- | -------- | -------------------------------------------- |
| `difficulty` | No       | `medium` | Word difficulty: `easy`, `medium`, or `hard` |

## Difficulty levels

| Level    | Word length                |
| -------- | -------------------------- |
| `easy`   | Short words (≤ 5 letters)  |
| `medium` | Medium words (6–8 letters) |
| `hard`   | Long words (9+ letters)    |

## Example

```bash
curl "https://api.uwuapps.org/random/hangman?difficulty=easy"
```

### Response

```json
{
  "success": true,
  "word": "apple",
  "length": 5,
  "difficulty": "easy",
  "hint": "_____"
}
```

## Response fields

| Field        | Description                                          |
| ------------ | ---------------------------------------------------- |
| `word`       | The word to guess                                    |
| `length`     | Number of characters in the word                     |
| `difficulty` | The difficulty level returned                        |
| `hint`       | Blank placeholder string (one underscore per letter) |
