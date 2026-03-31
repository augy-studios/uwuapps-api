const { success, error, handleCors } = require('../../lib/response');

// Loaded once at cold start and cached by Node's module system.
// Place your bucketed word list at public/wordlist.json in your repo.
let BUCKETS = null;
let LENGTHS = null;

function loadBuckets() {
  if (BUCKETS) return; // already loaded
  try {
    BUCKETS = require('../../public/wordlist.json');
  } catch {
    // Fallback: tiny inline list so the endpoint never hard-crashes
    BUCKETS = {
      4: ['rain', 'drop', 'wave', 'word', 'type'],
      5: ['storm', 'cloud', 'pixel', 'glyph', 'audio'],
      6: ['galaxy', 'signal', 'packet', 'matrix', 'chrome'],
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

  // Optional ?length=5
  const lengthParam = req.query.length !== undefined
    ? parseInt(req.query.length, 10)
    : null;

  if (lengthParam !== null) {
    if (isNaN(lengthParam) || lengthParam < 1 || lengthParam > 50) {
      return error(res, '"length" must be an integer between 1 and 50.');
    }
    if (!LENGTHS.includes(lengthParam)) {
      return error(
        res,
        `No words available with length ${lengthParam}. Available lengths: ${LENGTHS.join(', ')}.`,
        404
      );
    }
  }

  const targetLength = lengthParam !== null
    ? lengthParam
    : LENGTHS[Math.floor(Math.random() * LENGTHS.length)];

  const bucket = BUCKETS[targetLength];
  const word = bucket[Math.floor(Math.random() * bucket.length)];

  return success(res, {
    word,
    length: word.length,
  });
};
