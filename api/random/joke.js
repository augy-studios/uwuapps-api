const { success, error, handleCors } = require('../../lib/response');

const VALID_CATEGORIES = ['Any', 'Programming', 'Misc', 'Dark', 'Pun', 'Spooky', 'Christmas'];
const VALID_TYPES      = ['single', 'twopart'];
const BLACKLIST        = 'nsfw,religious,political,racist,sexist,explicit';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const rawCategory = req.query.category || 'Any';
  const rawType     = req.query.type     || 'single';

  const category = VALID_CATEGORIES.find(c => c.toLowerCase() === rawCategory.toLowerCase());
  if (!category) {
    return error(res, `Invalid category "${rawCategory}". Valid options: ${VALID_CATEGORIES.join(', ')}.`);
  }

  const type = VALID_TYPES.find(t => t.toLowerCase() === rawType.toLowerCase());
  if (!type) {
    return error(res, `Invalid type "${rawType}". Valid options: ${VALID_TYPES.join(', ')}.`);
  }

  const jokeUrl = `https://v2.jokeapi.dev/joke/${category}?blacklistFlags=${BLACKLIST}&type=${type}`;

  let data;
  try {
    const response = await fetch(jokeUrl);
    if (!response.ok) {
      return error(res, `JokeAPI returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach JokeAPI. Please try again.', 502);
  }

  if (data.error) {
    return res.status(404).json({
      success: false,
      message: data.message || 'No joke found for the given parameters.',
    });
  }

  // Shape response based on type
  if (type === 'twopart') {
    return success(res, {
      category: data.category,
      type:     'twopart',
      setup:    data.setup,
      delivery: data.delivery,
    });
  }

  return success(res, {
    category: data.category,
    type:     'single',
    joke:     data.joke,
  });
};
