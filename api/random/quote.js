const { success, error, handleCors } = require('../../lib/response');

const QUOTABLE_URL = 'https://api.quotable.io/random';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const params = new URLSearchParams();
  if (req.query.tags)      params.set('tags',      req.query.tags);
  if (req.query.maxLength) params.set('maxLength',  req.query.maxLength);

  const url = `${QUOTABLE_URL}${params.toString() ? '?' + params.toString() : ''}`;

  let data;
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'No quotes found for the given filters.',
      });
    }
    if (!response.ok) {
      return error(res, `Quotable API returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Quotable API. Please try again.', 502);
  }

  return success(res, {
    quote:  data.content,
    author: data.author,
    length: data.length,
    tags:   data.tags || [],
  });
};
