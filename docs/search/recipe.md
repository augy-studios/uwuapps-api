# Search Recipes

Searches for meal recipes by name. Powered by [TheMealDB](https://www.themealdb.com).

```
GET /api/search/recipe
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `q` | Yes | Meal name to search for |

## Example

```bash
curl "https://api.uwuapps.com/api/search/recipe?q=pasta"
```

### Response

```json
{
  "success": true,
  "meals": [
    {
      "id": "52772",
      "name": "Teriyaki Chicken Casserole",
      "category": "Chicken",
      "area": "Japanese",
      "instructions": "Preheat oven to 350...",
      "thumbnail": "https://www.themealdb.com/images/media/meals/...",
      "tags": ["Meat", "Casserole"],
      "youtube": "https://www.youtube.com/watch?v=...",
      "ingredients": [
        { "name": "soy sauce", "measure": "3/4 cup" }
      ]
    }
  ]
}
```

## Notes

- Returns an array of matching meals.
- Returns `404` if no meals match the query.
- Returns `502` if TheMealDB is unreachable.
