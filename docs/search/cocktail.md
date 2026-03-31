# Cocktail

Searches for cocktail recipes by name. Powered by [TheCocktailDB](https://www.thecocktaildb.com).

```
GET /search/cocktail
```

## Parameters

| Parameter | Required | Description                 |
| --------- | -------- | --------------------------- |
| `q`       | Yes      | Cocktail name to search for |

## Example

```bash
curl "https://api.uwuapps.org/search/cocktail?q=margarita"
```

### Response

```json
{
  "success": true,
  "drinks": [
    {
      "id": "11007",
      "name": "Margarita",
      "category": "Ordinary Drink",
      "alcoholic": "Alcoholic",
      "glass": "Cocktail glass",
      "instructions": "Rub the rim of the glass...",
      "thumbnail": "https://www.thecocktaildb.com/images/media/drink/...",
      "ingredients": [
        { "name": "Tequila", "measure": "1 1/2 oz" },
        { "name": "Triple sec", "measure": "1/2 oz" },
        { "name": "Lime juice", "measure": "1 oz" }
      ]
    }
  ]
}
```

## Notes

* Returns an array of matching cocktails.
* Returns `404` if no cocktails match the query.
* Returns `502` if TheCocktailDB is unreachable.
