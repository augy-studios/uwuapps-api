const { success, error, handleCors } = require('../../lib/response');

const DICT_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. serendipity).');
  }

  const word = q.trim().replace(/\s+/g, ' ');

  let data;
  try {
    const response = await fetch(`${DICT_URL}${encodeURIComponent(word)}`);
    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: `No definition found for "${word}".`,
      });
    }
    if (!response.ok) {
      return error(res, `Dictionary API returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Dictionary API. Please try again.', 502);
  }

  // API returns an object with a title field when word is not found
  if (data.title) {
    return res.status(404).json({
      success: false,
      message: `No definition found for "${word}".`,
    });
  }

  const entry    = data[0];
  const meaning  = entry.meanings[0];
  const def      = meaning.definitions[0];

  // Find best phonetic (prefer one with audio)
  const phoneticObj = entry.phonetics?.find(p => p.audio && p.text)
                   || entry.phonetics?.find(p => p.text)
                   || {};

  // Collect all meanings (not just the first)
  const meanings = entry.meanings.map(m => ({
    partOfSpeech: m.partOfSpeech,
    definitions:  m.definitions.slice(0, 3).map(d => ({
      definition: d.definition,
      example:    d.example  || null,
      synonyms:   d.synonyms?.slice(0, 5) || [],
      antonyms:   d.antonyms?.slice(0, 5) || [],
    })),
    synonyms: m.synonyms?.slice(0, 5) || [],
    antonyms: m.antonyms?.slice(0, 5) || [],
  }));

  return success(res, {
    word:         entry.word,
    phonetic:     phoneticObj.text  || null,
    audio:        phoneticObj.audio || null,
    // Top-level shorthand (matches original PWA's usage)
    partOfSpeech: meaning.partOfSpeech,
    definition:   def.definition,
    example:      def.example  || null,
    synonyms:     def.synonyms?.slice(0, 5) || [],
    // Full breakdown across all meanings
    meanings,
  });
};
