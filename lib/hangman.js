const WORD_LIST = [
  { word: "hangman",       hint: "The name of this game." },
  { word: "guitar",        hint: "A musical instrument with strings." },
  { word: "oxygen",        hint: "A colorless, odorless gas essential for life." },
  { word: "mountain",      hint: "A large natural elevation of the Earth's surface." },
  { word: "painting",      hint: "An art form using colors on a surface to create images or expression." },
  { word: "astronomy",     hint: "The scientific study of celestial objects and phenomena." },
  { word: "football",      hint: "A popular sport played with a spherical ball." },
  { word: "chocolate",     hint: "A sweet treat made from cocoa beans." },
  { word: "butterfly",     hint: "An insect with colorful wings and a slender body." },
  { word: "history",       hint: "The study of past events and human civilization." },
  { word: "pizza",         hint: "A savory dish consisting of a round, flattened base with toppings." },
  { word: "jazz",          hint: "A genre of music characterized by improvisation and syncopation." },
  { word: "camera",        hint: "A device used to capture and record images or videos." },
  { word: "diamond",       hint: "A precious gemstone known for its brilliance and hardness." },
  { word: "adventure",     hint: "An exciting or daring experience." },
  { word: "science",       hint: "The systematic study of the structure and behavior of the physical and natural world." },
  { word: "bicycle",       hint: "A human-powered vehicle with two wheels." },
  { word: "sunset",        hint: "The daily disappearance of the sun below the horizon." },
  { word: "coffee",        hint: "A popular caffeinated beverage made from roasted coffee beans." },
  { word: "dance",         hint: "A rhythmic movement of the body often performed to music." },
  { word: "galaxy",        hint: "A vast system of stars, gas, and dust held together by gravity." },
  { word: "orchestra",     hint: "A large ensemble of musicians playing various instruments." },
  { word: "volcano",       hint: "A mountain or hill with a vent through which lava, rock fragments, hot vapor, and gas are ejected." },
  { word: "novel",         hint: "A long work of fiction, typically with a complex plot and characters." },
  { word: "sculpture",     hint: "A three-dimensional art form created by shaping or combining materials." },
  { word: "symphony",      hint: "A long musical composition for a full orchestra, typically in multiple movements." },
  { word: "architecture",  hint: "The art and science of designing and constructing buildings." },
  { word: "ballet",        hint: "A classical dance form characterized by precise and graceful movements." },
  { word: "astronaut",     hint: "A person trained to travel and work in space." },
  { word: "waterfall",     hint: "A cascade of water falling from a height." },
  { word: "technology",    hint: "The application of scientific knowledge for practical purposes." },
  { word: "rainbow",       hint: "A meteorological phenomenon caused by reflection, refraction, and dispersion of light." },
  { word: "universe",      hint: "All existing matter, space, and time as a whole." },
  { word: "piano",         hint: "A musical instrument played by pressing keys that cause hammers to strike strings." },
  { word: "vacation",      hint: "A period of time devoted to pleasure, rest, or relaxation." },
  { word: "rainforest",    hint: "A dense forest characterized by high rainfall and biodiversity." },
  { word: "theater",       hint: "A building or outdoor area in which plays, movies, or other performances are staged." },
  { word: "telephone",     hint: "A device used to transmit sound over long distances." },
  { word: "language",      hint: "A system of communication consisting of words, gestures, and syntax." },
  { word: "desert",        hint: "A barren or arid land with little or no precipitation." },
  { word: "sunflower",     hint: "A tall plant with a large yellow flower head." },
  { word: "fantasy",       hint: "A genre of imaginative fiction involving magic and supernatural elements." },
  { word: "telescope",     hint: "An optical instrument used to view distant objects in space." },
  { word: "breeze",        hint: "A gentle wind." },
  { word: "oasis",         hint: "A fertile spot in a desert where water is found." },
  { word: "photography",   hint: "The art, process, or practice of creating images by recording light or other electromagnetic radiation." },
  { word: "safari",        hint: "An expedition or journey, typically to observe wildlife in their natural habitat." },
  { word: "planet",        hint: "A celestial body that orbits a star and does not produce light of its own." },
  { word: "river",         hint: "A large natural stream of water flowing in a channel to the sea, a lake, or another such stream." },
  { word: "tropical",      hint: "Relating to or situated in the region between the Tropic of Cancer and the Tropic of Capricorn." },
  { word: "mysterious",    hint: "Difficult or impossible to understand, explain, or identify." },
  { word: "enigma",        hint: "Something that is mysterious, puzzling, or difficult to understand." },
  { word: "paradox",       hint: "A statement or situation that contradicts itself or defies intuition." },
  { word: "puzzle",        hint: "A game, toy, or problem designed to test ingenuity or knowledge." },
  { word: "whisper",       hint: "To speak very softly or quietly, often in a secretive manner." },
  { word: "shadow",        hint: "A dark area or shape produced by an object blocking the light." },
  { word: "secret",        hint: "Something kept hidden or unknown to others." },
  { word: "curiosity",     hint: "A strong desire to know or learn something." },
  { word: "unpredictable", hint: "Not able to be foreseen or known beforehand; uncertain." },
  { word: "obfuscate",     hint: "To confuse or bewilder someone; to make something unclear or difficult to understand." },
  { word: "unveil",        hint: "To make known or reveal something previously secret or unknown." },
  { word: "illusion",      hint: "A false perception or belief; a deceptive appearance or impression." },
  { word: "moonlight",     hint: "The light from the moon." },
  { word: "vibrant",       hint: "Full of energy, brightness, and life." },
  { word: "nostalgia",     hint: "A sentimental longing or wistful affection for the past." },
  { word: "brilliant",     hint: "Exceptionally clever, talented, or impressive." },
  { word: "elephant",      hint: "A large land mammal with a trunk and tusks." },
  { word: "computer",      hint: "A device used for processing and storing data." },
  { word: "basketball",    hint: "A sport played with a round ball." },
  { word: "ocean",         hint: "A vast body of saltwater." },
  { word: "library",       hint: "A place with books and other sources of information." },
  { word: "moon",          hint: "The natural satellite of the Earth." },
  { word: "beach",         hint: "A sandy or pebbly shore by the ocean." },
  { word: "music",         hint: "An art form that uses sound and rhythm." },
  { word: "rain",          hint: "Water falling from the clouds." },
  { word: "fireworks",     hint: "Explosive pyrotechnic displays." },
  { word: "soccer",        hint: "A sport played with a round ball and goalposts." },
  { word: "furry",         hint: "An enthusiast for animal characters with human characteristics." },
];

/**
 * Calculate max guesses based on game mode.
 *
 * hangman  — fixed 6 guesses (one per body part)
 * wordguess — 8 if word.length >= 5, else 6 (matches original word guess PWA)
 *
 * @param {string} word
 * @param {'hangman'|'wordguess'} game
 * @returns {number}
 */
function maxGuessesFor(word, game = 'hangman') {
  if (game === 'wordguess') return word.length >= 5 ? 8 : 6;
  return 6; // hangman default
}

/**
 * Pick a random word, optionally excluding specific words.
 *
 * @param {string[]} exclude  - Words to exclude (e.g. recently seen words)
 * @param {'hangman'|'wordguess'} game - Game mode, affects maxGuesses
 * @returns {{ word: string, hint: string, maxGuesses: number, total: number } | { error: string }}
 */
function getRandomWord(exclude = [], game = 'hangman') {
  if (!['hangman', 'wordguess'].includes(game)) {
    return { error: '"game" must be "hangman" or "wordguess".' };
  }

  const excludeSet = new Set(exclude.map(w => w.toLowerCase().trim()));
  const pool = WORD_LIST.filter(item => !excludeSet.has(item.word));

  if (pool.length === 0) {
    return { error: 'All words have been excluded. Reset your exclude list.' };
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    word:       picked.word,
    hint:       picked.hint,
    maxGuesses: maxGuessesFor(picked.word, game),
    total:      WORD_LIST.length,
  };
}

module.exports = { getRandomWord, maxGuessesFor, WORD_LIST };
