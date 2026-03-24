const { calculateAspect } = require('../../lib/calc');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const ratioW = parseFloat(req.query.ratioW);
  const ratioH = parseFloat(req.query.ratioH);
  const width   = req.query.width  != null ? parseFloat(req.query.width)  : null;
  const height  = req.query.height != null ? parseFloat(req.query.height) : null;

  if (isNaN(ratioW)) return error(res, 'Query parameter "ratioW" is required (number).');
  if (isNaN(ratioH)) return error(res, 'Query parameter "ratioH" is required (number).');
  if (width  != null && isNaN(width))  return error(res, '"width" must be a number.');
  if (height != null && isNaN(height)) return error(res, '"height" must be a number.');

  const result = calculateAspect(ratioW, ratioH, width, height);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
