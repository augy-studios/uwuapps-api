const { success, error, handleCors } = require('../../lib/response');

const OMDB_BASE = 'https://www.omdbapi.com/';

/**
 * Parse raw OMDB response into a clean shape.
 * @param {object} data - Raw OMDB API response
 * @returns {object}
 */
function parseMovie(data) {
  return {
    title:      data.Title,
    year:       data.Year,
    rated:      data.Rated,
    runtime:    data.Runtime,
    genre:      data.Genre ? data.Genre.split(',').map(g => g.trim()) : [],
    director:   data.Director,
    cast:       data.Actors,
    plot:       data.Plot,
    language:   data.Language,
    country:    data.Country,
    imdbRating: data.imdbRating,
    imdbVotes:  data.imdbVotes,
    imdbID:     data.imdbID,
    poster:     data.Poster !== 'N/A' ? data.Poster : null,
    type:       data.Type,
  };
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) return error(res, 'Server misconfiguration: OMDB_API_KEY is not set.', 500);

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. inception).');
  }

  let data;
  try {
    const url = `${OMDB_BASE}?t=${encodeURIComponent(q.trim())}&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      return error(res, `OMDB API returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach OMDB API. Please try again.', 502);
  }

  if (data.Response === 'False') {
    return res.status(404).json({
      success: false,
      message: data.Error || `No movie found for "${q}".`,
    });
  }

  return success(res, {
    query: q.trim(),
    movie: parseMovie(data),
  });
};
