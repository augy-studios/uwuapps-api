const { generateGradient } = require('../../lib/gradient');
const { success, error, handleCors } = require('../../lib/response');

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { colorA, colorB, direction = '180deg' } = req.query;

  if (!colorA) return error(res, 'Query parameter "colorA" is required (e.g. ff0000 or #ff0000).');
  if (!colorB) return error(res, 'Query parameter "colorB" is required (e.g. 0000ff or #0000ff).');

  const result = generateGradient(colorA, colorB, direction);
  if (result.error) return error(res, result.error);

  return success(res, result);
};
