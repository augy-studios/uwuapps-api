const { success, error, handleCors } = require('../../lib/response');

const CHOICES = ['rock', 'paper', 'scissors'];

const OUTCOMES = {
  rock:     { rock: 'draw', paper: 'lose', scissors: 'win'  },
  paper:    { rock: 'win',  paper: 'draw', scissors: 'lose' },
  scissors: { rock: 'lose', paper: 'win',  scissors: 'draw' },
};

module.exports = (req, res) => {
  if (handleCors(req, res)) return;

  const { choice } = req.query;
  if (!choice || choice.trim().length === 0) {
    return error(res, `Query parameter "choice" is required. Valid options: ${CHOICES.join(', ')}.`);
  }

  const userChoice = choice.trim().toLowerCase();
  if (!CHOICES.includes(userChoice)) {
    return error(res, `Invalid choice "${choice}". Valid options: ${CHOICES.join(', ')}.`);
  }

  const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
  const result = OUTCOMES[userChoice][computerChoice];

  return success(res, { userChoice, computerChoice, result });
};
