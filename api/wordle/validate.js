const { success, error, handleCors } = require('../../lib/response');

let BUCKETS = null;
let WORD_SET = null;

function loadBuckets() {
  if (BUCKETS) return;
  try {
    BUCKETS = require('../../public/wordlist.json');
  } catch {
    BUCKETS = {
      5: ['apple', 'grape', 'plain', 'crown', 'flame', 'zesty', 'brick', 'smile'],
    };
  }
  // Flatten all words into a Set for O(1) lookup
  WORD_SET = new Set();
  for (const key of Object.keys(BUCKETS)) {
    const bucket = BUCKETS[key];
    if (Array.isArray(bucket)) {
      for (const w of bucket) WORD_SET.add(String(w).toLowerCase().trim());
    }
  }
}

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  loadBuckets();

  // Accept both GET ?word=... and POST { word }
  let word;
  if (req.method === 'POST') {
    word = req.body?.word;
  } else {
    word = req.query.word;
  }

  if (!word || typeof word !== 'string') {
    return error(res, '"word" is required.');
  }

  const clean = word.trim().toLowerCase();

  if (!/^[a-z]+$/.test(clean)) {
    return error(res, '"word" must contain only letters.');
  }

  const valid = WORD_SET.has(clean);

  return success(res, {
    word: clean,
    length: clean.length,
    valid,
  });
};
