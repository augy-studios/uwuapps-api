# Random Joke

Returns a random joke. Powered by [JokeAPI](https://v2.jokeapi.dev).

```
GET /api/random/joke
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `category` | No | `Any` | Joke category (see below) |
| `type` | No | `single` | Joke format: `single` or `twopart` |

## Categories

`Any`, `Programming`, `Misc`, `Dark`, `Pun`, `Spooky`, `Christmas`

## Example

**Single joke:**

```bash
curl "https://api.uwuapps.com/api/random/joke?category=Programming&type=single"
```

### Response (single)

```json
{
  "success": true,
  "category": "Programming",
  "type": "single",
  "joke": "Why do programmers prefer dark mode? Because light attracts bugs."
}
```

**Two-part joke:**

```bash
curl "https://api.uwuapps.com/api/random/joke?type=twopart"
```

### Response (twopart)

```json
{
  "success": true,
  "category": "Misc",
  "type": "twopart",
  "setup": "Why don't scientists trust atoms?",
  "delivery": "Because they make up everything."
}
```

## Notes

- Jokes are filtered to exclude NSFW, religious, political, racist, sexist, and explicit content.
- Returns `502` if JokeAPI is unreachable.
