const { libreTranslate, libreDetect, myMemoryTranslate } = require('../../lib/translate');
const { success, error, handleCors } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { text, to } = req.query;
  let   { from }     = req.query;

  if (!text || text.trim().length === 0) {
    return error(res, 'Query parameter "text" is required.');
  }
  if (!to || to.trim().length === 0) {
    return error(res, 'Query parameter "to" is required (e.g. zh-CN, es, fr).');
  }

  const sourceText = text.trim();
  let sourceLang   = (from || 'auto').trim();

  // Auto-detect source language if requested
  if (sourceLang === 'auto') {
    const detected = await libreDetect(sourceText);
    sourceLang     = detected.language;
  }

  // Bail early if same language
  if (sourceLang === to.trim()) {
    return success(res, {
      text:       sourceText,
      from:       sourceLang,
      to:         to.trim(),
      engine:     'none (same language)',
      translated: sourceText,
    });
  }

  let result;
  try {
    result = await libreTranslate(sourceText, sourceLang, to.trim());
  } catch {
    try {
      result = await myMemoryTranslate(sourceText, sourceLang, to.trim());
    } catch {
      return error(res, 'All translation engines failed. Please try again later.', 502);
    }
  }

  return success(res, {
    from:       sourceLang,
    to:         to.trim(),
    original:   sourceText,
    translated: result.text,
    engine:     result.engine,
  });
};
