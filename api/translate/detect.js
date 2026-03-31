const { libreDetect } = require('../../lib/translate');
const { success, error, handleCors } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { text } = req.query;
  if (!text || text.trim().length === 0) {
    return error(res, 'Query parameter "text" is required.');
  }

  const result = await libreDetect(text.trim());

  return success(res, {
    text:       text.trim(),
    language:   result.language,
    confidence: result.confidence,
    engine:     result.engine,
  });
};
