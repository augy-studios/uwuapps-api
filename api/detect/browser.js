const { parseUserAgent } = require('../../lib/detect');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  // Allow manual UA override via query param (useful for testing)
  const ua = req.query.ua || req.headers['user-agent'] || '';

  if (!ua) {
    return error(res, 'No User-Agent found in request headers.');
  }

  const result = parseUserAgent(ua);
  return success(res, result);
};
