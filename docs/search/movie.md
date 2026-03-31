# Search Movies

Searches for movies by title. Powered by the [OMDB API](https://www.omdbapi.com).

```
GET /api/search/movie
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `q` | Yes | Movie title to search for |

## Example

```bash
curl "https://api.uwuapps.com/api/search/movie?q=Inception"
```

### Response

```json
{
  "success": true,
  "title": "Inception",
  "year": "2010",
  "rated": "PG-13",
  "runtime": "148 min",
  "genre": "Action, Adventure, Sci-Fi",
  "director": "Christopher Nolan",
  "plot": "A thief who steals corporate secrets...",
  "poster": "https://m.media-amazon.com/images/...",
  "imdbRating": "8.8",
  "imdbID": "tt1375666"
}
```

## Notes

- Requires a valid `OMDB_API_KEY` configured on the server.
- Returns the first matching result for the given title.
- Returns `404` if no movie is found.
- Returns `502` if the OMDB API is unreachable.
