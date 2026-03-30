const { success, error, handleCors } = require('../../lib/response');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { name } = req.query;
  if (!name || name.trim().length === 0) {
    return error(res, 'Query parameter "name" is required (e.g. james).');
  }
  if (!/^[A-Za-z]+$/.test(name.trim())) {
    return error(res, '"name" must contain letters only, no spaces or special characters.');
  }

  let data;
  try {
    const response = await fetch(`https://api.agify.io?name=${encodeURIComponent(name.trim())}`);
    if (!response.ok) {
      return error(res, `Agify.io returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach Agify.io. Please try again.', 502);
  }

  if (data.age === null) {
    return res.status(404).json({
      success: false,
      message: `Could not predict age for "${name}".`,
    });
  }

  return success(res, {
    name:  data.name,
    age:   data.age,
    count: data.count,
  });
};
