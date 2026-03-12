/**
 * Pure conversion functions — zero HTTP/DOM awareness.
 */

// ─── Temperature ─────────────────────────────────────────

const TEMP_UNITS = ['c', 'f', 'k'];

function convertTemperature(value, from, to) {
  from = (from || '').toLowerCase();
  to = (to || '').toLowerCase();

  if (!TEMP_UNITS.includes(from)) return { error: `Invalid "from" unit. Use: ${TEMP_UNITS.join(', ')}` };
  if (!TEMP_UNITS.includes(to)) return { error: `Invalid "to" unit. Use: ${TEMP_UNITS.join(', ')}` };
  if (isNaN(value)) return { error: 'Value must be a number.' };

  // Normalize to Celsius first
  let celsius;
  switch (from) {
    case 'c': celsius = value; break;
    case 'f': celsius = (value - 32) * 5 / 9; break;
    case 'k': celsius = value - 273.15; break;
  }

  // Convert from Celsius to target
  let result;
  switch (to) {
    case 'c': result = celsius; break;
    case 'f': result = (celsius * 9 / 5) + 32; break;
    case 'k': result = celsius + 273.15; break;
  }

  return {
    value,
    from,
    to,
    result: parseFloat(result.toFixed(4)),
  };
}

// ─── Weight ──────────────────────────────────────────────

const WEIGHT_UNITS = ['kg', 'lb', 'oz'];

function convertWeight(value, from, to) {
  from = (from || '').toLowerCase();
  to = (to || '').toLowerCase();

  if (!WEIGHT_UNITS.includes(from)) return { error: `Invalid "from" unit. Use: ${WEIGHT_UNITS.join(', ')}` };
  if (!WEIGHT_UNITS.includes(to)) return { error: `Invalid "to" unit. Use: ${WEIGHT_UNITS.join(', ')}` };
  if (isNaN(value)) return { error: 'Value must be a number.' };

  // Normalize to kg first
  let kg;
  switch (from) {
    case 'kg': kg = value; break;
    case 'lb': kg = value / 2.20462262185; break;
    case 'oz': kg = value / 35.27396195; break;
  }

  let result;
  switch (to) {
    case 'kg': result = kg; break;
    case 'lb': result = kg * 2.20462262185; break;
    case 'oz': result = kg * 35.27396195; break;
  }

  return {
    value,
    from,
    to,
    result: parseFloat(result.toFixed(4)),
  };
}

// ─── Base (Binary / Decimal / Hex / Octal) ───────────────

const BASE_MAP = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
};
const BASE_NAMES = Object.keys(BASE_MAP);

function convertBase(value, from, to) {
  from = (from || '').toLowerCase();
  to = (to || '').toLowerCase();

  if (!BASE_MAP[from]) return { error: `Invalid "from" base. Use: ${BASE_NAMES.join(', ')}` };
  if (!BASE_MAP[to]) return { error: `Invalid "to" base. Use: ${BASE_NAMES.join(', ')}` };
  if (!value && value !== '0') return { error: 'Value is required.' };

  const str = String(value).trim();

  // Validate input characters for the source base
  const fromBase = BASE_MAP[from];
  const validChars = '0123456789abcdef'.slice(0, fromBase);
  const normalized = str.toLowerCase().replace(/^0[xXbBoO]/, ''); // strip optional prefix
  for (const ch of normalized) {
    if (!validChars.includes(ch)) {
      return { error: `Invalid character "${ch}" for base ${from} (${fromBase}).` };
    }
  }

  const decimal = parseInt(normalized, fromBase);
  if (isNaN(decimal)) return { error: 'Could not parse the input value.' };

  let result = decimal.toString(BASE_MAP[to]);
  if (to === 'hex') result = result.toUpperCase();

  return {
    value: str,
    from,
    to,
    decimal,
    result,
  };
}

// ─── Morse Code ──────────────────────────────────────────

const MORSE_MAP = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.',
  ' ': '/',
};

const REVERSE_MORSE = {};
for (const [k, v] of Object.entries(MORSE_MAP)) {
  REVERSE_MORSE[v] = k;
}

function convertMorse(text) {
  if (!text || !text.trim()) return { error: 'Text is required.' };

  const input = text.trim();

  // Auto-detect direction: if input contains dots or dashes, treat as morse → text
  const isMorse = /[.\-/]/.test(input) && !/[a-zA-Z]{2,}/.test(input);

  if (isMorse) {
    // Morse → Text
    const words = input.split(/\s*\/\s*/);
    const decoded = words.map(word => {
      const chars = word.trim().split(/\s+/);
      return chars.map(ch => REVERSE_MORSE[ch] || '?').join('');
    }).join(' ');

    return {
      direction: 'morse_to_text',
      input,
      result: decoded,
    };
  } else {
    // Text → Morse
    const upper = input.toUpperCase();
    const encoded = Array.from(upper).map(ch => MORSE_MAP[ch] || ch).join(' ')
      .replace(/ \/ /g, ' / '); // clean up word separators

    return {
      direction: 'text_to_morse',
      input,
      result: encoded,
    };
  }
}

// ─── Currency ────────────────────────────────────────────

const CURRENCY_API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';

async function convertCurrency(amount, from, to) {
  if (isNaN(amount) || amount < 0) return { error: 'Amount must be a non-negative number.' };
  if (!from) return { error: '"from" currency code is required.' };
  if (!to) return { error: '"to" currency code is required.' };

  from = from.toUpperCase();
  to = to.toUpperCase();

  if (from === to) {
    return { amount, from, to, rate: 1, result: amount };
  }

  const base = from.toLowerCase();
  const target = to.toLowerCase();

  const res = await fetch(`${CURRENCY_API_BASE}/currencies/${base}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Upstream API returned HTTP ${res.status}`);

  const data = await res.json();
  const rates = data[base];
  const rate = rates?.[target];

  if (typeof rate !== 'number') {
    return { error: `Rate not available for ${from} → ${to}.` };
  }

  const result = Math.round(amount * rate * 1000000) / 1000000;

  return {
    amount,
    from,
    to,
    rate,
    result,
    date: data.date || null,
  };
}

module.exports = {
  convertTemperature, TEMP_UNITS,
  convertWeight, WEIGHT_UNITS,
  convertBase, BASE_NAMES,
  convertMorse,
  convertCurrency,
};
