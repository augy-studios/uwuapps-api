const { success, error, handleCors } = require('../../lib/response');

const DEFAULT_LENGTH = 5;
const MAX_LENGTH = 50;

let BUCKETS = null;
let LENGTHS = null;

function loadBuckets() {
  if (BUCKETS) return;
  try {
    BUCKETS = require('../../public/wordlist.json');
  } catch {
    BUCKETS = {
      5: ['apple', 'grape', 'plain', 'crown', 'flame', 'zesty', 'brick', 'smile'],
    };
  }
  LENGTHS = Object.keys(BUCKETS)
    .map(n => parseInt(n, 10))
    .filter(n => !isNaN(n) && Array.isArray(BUCKETS[n]) && BUCKETS[n].length > 0)
    .sort((a, b) => a - b);
}

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  loadBuckets();

  const raw = req.query.length !== undefined ? req.query.length : String(DEFAULT_LENGTH);
  const length = parseInt(raw, 10);

  if (isNaN(length) || length < 1 || length > MAX_LENGTH) {
    return error(res, `"length" must be an integer between 1 and ${MAX_LENGTH}.`);
  }

  if (!LENGTHS.includes(length)) {
    return error(
      res,
      `No words available with length ${length}. Available lengths: ${LENGTHS.join(', ')}.`,
      404
    );
  }

  const bucket = BUCKETS[length];
  const word = bucket[Math.floor(Math.random() * bucket.length)];

  return success(res, {
    word,
    length: word.length,
  });
};
