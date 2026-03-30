const { success, error, handleCors } = require('../../lib/response');

const VALID_FORMATS = ['png', 'svg', 'eps'];
const MAX_SIZE = 1000;
const DEFAULT_SIZE = 200;

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { data, format = 'png' } = req.query;
  const size = req.query.size != null ? parseInt(req.query.size, 10) : DEFAULT_SIZE;

  if (!data || data.trim().length === 0) {
    return error(res, 'Query parameter "data" is required (text or URL to encode).');
  }
  if (isNaN(size) || size < 10) {
    return error(res, '"size" must be a positive integer (minimum 10).');
  }
  if (size > MAX_SIZE) {
    return error(res, `"size" cannot exceed ${MAX_SIZE}.`);
  }
  if (!VALID_FORMATS.includes(format.toLowerCase())) {
    return error(res, `"format" must be one of: ${VALID_FORMATS.join(', ')}.`);
  }

  const encoded = encodeURIComponent(data.trim());
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=${format.toLowerCase()}&data=${encoded}`;

  return success(res, {
    data:   data.trim(),
    url,
    size,
    format: format.toLowerCase(),
  });
};
