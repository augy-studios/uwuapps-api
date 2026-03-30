const { success, error, handleCors } = require('../../lib/response');

const MEALDB_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

/**
 * Parse raw MealDB meal object into a clean shape.
 * @param {object} meal - Raw meal object from TheMealDB
 * @returns {object}
 */
function parseMeal(meal) {
  // Extract ingredients + measures (up to 20 slots)
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    if (!ingredient) break;
    const measure = meal[`strMeasure${i}`]?.trim() || '';
    ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
  }

  return {
    id:           meal.idMeal,
    name:         meal.strMeal,
    category:     meal.strCategory,
    area:         meal.strArea,
    thumb:        meal.strMealThumb,
    tags:         meal.strTags ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    youtube:      meal.strYoutube || null,
    source:       meal.strSource  || null,
    instructions: meal.strInstructions,
    ingredients,
  };
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. chicken).');
  }

  let data;
  try {
    const response = await fetch(MEALDB_URL + encodeURIComponent(q.trim()));
    if (!response.ok) {
      return error(res, `TheMealDB returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach TheMealDB. Please try again.', 502);
  }

  if (!data.meals || data.meals.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No recipes found for "${q}".`,
    });
  }

  const meals = data.meals.map(parseMeal);

  return success(res, {
    query:  q.trim(),
    total:  meals.length,
    match:  meals[0],
    others: meals.slice(1),
  });
};
