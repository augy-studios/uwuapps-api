const { success, error, handleCors } = require('../../lib/response');

const COCKTAILDB_URL = 'https://thecocktaildb.com/api/json/v1/1/search.php?s=';

/**
 * Parse raw CocktailDB drink object into a clean response shape.
 *
 * @param {object} drink - Raw drink object from TheCocktailDB
 * @returns {{ name, thumb, category, glass, alcoholic, instructions, ingredients }}
 */
function parseDrink(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    if (!ingredient) break;
    const measure = drink[`strMeasure${i}`]?.trim() || '';
    ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
  }

  return {
    name:         drink.strDrink,
    thumb:        drink.strDrinkThumb,
    category:     drink.strCategory,
    glass:        drink.strGlass,
    alcoholic:    drink.strAlcoholic,
    instructions: drink.strInstructions,
    ingredients,
  };
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. margarita).');
  }

  let data;
  try {
    const response = await fetch(COCKTAILDB_URL + encodeURIComponent(q.trim()));
    if (!response.ok) {
      return error(res, `TheCocktailDB returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach TheCocktailDB. Please try again.', 502);
  }

  if (!data.drinks || data.drinks.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No cocktails found for "${q}".`,
    });
  }

  // Return the closest match (first result) plus total hits
  const drinks = data.drinks.map(parseDrink);

  return success(res, {
    query:   q.trim(),
    total:   drinks.length,
    match:   drinks[0],      // best/first result
    others:  drinks.slice(1), // remaining matches if any
  });
};
