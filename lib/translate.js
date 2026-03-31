const LIBRE_INSTANCES = [
  'https://translate.argosopentech.com',
  'https://libretranslate.com',
  'https://libretranslate.de',
];

/**
 * Heuristic language detection using Unicode ranges.
 * @param {string} text
 * @returns {string} language code
 */
function heuristicDetect(text) {
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  if (/[\u3400-\u4DBF\u4E00-\u9FFF]/.test(text)) return 'zh';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  if (/[\u0590-\u05FF]/.test(text)) return 'he';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  return 'en';
}

/**
 * Translate text using LibreTranslate (tries multiple instances).
 * @param {string} text
 * @param {string} source - language code or 'auto'
 * @param {string} target - language code
 * @returns {Promise<{ text: string, engine: string }>}
 */
async function libreTranslate(text, source, target) {
  const payload = {
    q:      text,
    source: source || 'auto',
    target,
    format: 'text',
  };

  for (const base of LIBRE_INSTANCES) {
    try {
      const res = await fetch(`${base}/translate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.translatedText) {
        return { text: data.translatedText, engine: `LibreTranslate (${new URL(base).host})` };
      }
    } catch { /* try next */ }
  }
  throw new Error('LibreTranslate unavailable');
}

/**
 * Detect language using LibreTranslate (tries multiple instances).
 * Falls back to heuristic detection.
 * @param {string} text
 * @returns {Promise<{ language: string, confidence: number|null, engine: string }>}
 */
async function libreDetect(text) {
  for (const base of LIBRE_INSTANCES) {
    try {
      const res = await fetch(`${base}/detect`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ q: text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.language) {
        return {
          language:   data[0].language,
          confidence: data[0].confidence ?? null,
          engine:     `LibreTranslate (${new URL(base).host})`,
        };
      }
    } catch { /* try next */ }
  }

  // Fallback: heuristic
  return {
    language:   heuristicDetect(text),
    confidence: null,
    engine:     'heuristic',
  };
}

/**
 * Translate text using MyMemory (no key, rate-limited).
 * @param {string} text
 * @param {string} source
 * @param {string} target
 * @returns {Promise<{ text: string, engine: string }>}
 */
async function myMemoryTranslate(text, source, target) {
  const lp  = `${(source || 'en').split('-')[0]}|${target.split('-')[0]}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${lp}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const out  = data?.responseData?.translatedText;
  if (out) return { text: out, engine: 'MyMemory' };
  throw new Error('MyMemory failed');
}

module.exports = { libreTranslate, libreDetect, myMemoryTranslate, heuristicDetect };
