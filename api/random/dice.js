const { success, error, handleCors } = require('../../lib/response');

const DEFAULT_DICE  = 2;
const DEFAULT_SIDES = 6;
const MAX_DICE      = 20;
const MAX_SIDES     = 1000;

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  let dice  = DEFAULT_DICE;
  let sides = DEFAULT_SIDES;

  // Support shorthand ?type=2d6 notation
  if (req.query.type) {
    const parts = req.query.type.toLowerCase().split('d');
    if (parts.length !== 2) {
      return error(res, '"type" must be in the format NdS (e.g. 2d6, 4d20).');
    }
    dice  = parseInt(parts[0], 10);
    sides = parseInt(parts[1], 10);
  } else {
    if (req.query.dice  != null) dice  = parseInt(req.query.dice,  10);
    if (req.query.sides != null) sides = parseInt(req.query.sides, 10);
  }

  if (isNaN(dice)  || dice  < 1) return error(res, '"dice" must be a positive integer.');
  if (isNaN(sides) || sides < 2) return error(res, '"sides" must be an integer of 2 or more.');
  if (dice  > MAX_DICE)  return error(res, `"dice" cannot exceed ${MAX_DICE}.`);
  if (sides > MAX_SIDES) return error(res, `"sides" cannot exceed ${MAX_SIDES}.`);

  const results = Array.from({ length: dice }, () =>
    Math.floor(Math.random() * sides) + 1
  );
  const total = results.reduce((sum, n) => sum + n, 0);

  return success(res, {
    type: `${dice}d${sides}`,
    dice,
    sides,
    results,
    total,
  });
};
