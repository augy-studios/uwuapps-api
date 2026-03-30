const { success, error, handleCors } = require('../../lib/response');

const TYPE_COLORS = {
  bug:      '#26de81',
  dragon:   '#ffeaa7',
  electric: '#fed330',
  fairy:    '#FF0069',
  fighting: '#30336b',
  fire:     '#f0932b',
  flying:   '#81ecec',
  grass:    '#00b894',
  ground:   '#EFB549',
  ghost:    '#a55eea',
  ice:      '#74b9ff',
  normal:   '#95afc0',
  poison:   '#6c5ce7',
  psychic:  '#a29bfe',
  rock:     '#2d3436',
  water:    '#0190FF',
};

const MAX_ID = 151;

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  // Optional specific ID, otherwise random
  let id;
  if (req.query.id != null) {
    id = parseInt(req.query.id, 10);
    if (isNaN(id) || id < 1 || id > MAX_ID) {
      return error(res, `"id" must be an integer between 1 and ${MAX_ID}.`);
    }
  } else {
    id = Math.floor(Math.random() * MAX_ID) + 1;
  }

  let data;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      return error(res, `PokéAPI returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach PokéAPI. Please try again.', 502);
  }

  const primaryType = data.types[0].type.name;
  const name = data.name[0].toUpperCase() + data.name.slice(1);

  return success(res, {
    id:         data.id,
    name,
    types:      data.types.map(t => t.type.name),
    themeColor: TYPE_COLORS[primaryType] || '#95afc0',
    image:      data.sprites.other?.dream_world?.front_default
                  || data.sprites.other?.['official-artwork']?.front_default
                  || data.sprites.front_default,
    stats: {
      hp:       data.stats[0].base_stat,
      attack:   data.stats[1].base_stat,
      defense:  data.stats[2].base_stat,
      speed:    data.stats[5].base_stat,
    },
  });
};
