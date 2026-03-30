const { getRandomWord } = require('../../lib/hangman');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  // ?exclude=volcano,pizza,guitar — comma-separated words to avoid
  const excludeRaw = req.query.exclude || '';
  const exclude = excludeRaw
    ? excludeRaw.split(',').map(w => w.trim()).filter(Boolean)
    : [];

  if (exclude.length > 100) {
    return error(res, '"exclude" cannot contain more than 100 words.');
  }

  const result = getRandomWord(exclude);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
