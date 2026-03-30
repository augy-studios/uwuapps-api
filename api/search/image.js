const { parsePhoto, parsePagination } = require('../../lib/pexels');
const { success, error, handleCors } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return error(res, 'Server misconfiguration: PEXELS_API_KEY is not set.', 500);

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. nature).');
  }

  const pagination = parsePagination(req.query);
  if (pagination.error) return error(res, pagination.error);
  const { page, perPage } = pagination;

  let data;
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q.trim())}&page=${page}&per_page=${perPage}`;
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });
    if (!response.ok) {
      return error(res, `Pexels API returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Pexels API. Please try again.', 502);
  }

  if (!data.photos || data.photos.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No images found for "${q}".`,
    });
  }

  return success(res, {
    query:      q.trim(),
    page,
    perPage,
    totalResults: data.total_results,
    hasNextPage:  !!data.next_page,
    photos:     data.photos.map(parsePhoto),
  });
};
