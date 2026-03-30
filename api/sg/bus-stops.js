const { success, error, handleCors } = require('../../lib/response');

const STOPS_URL = 'https://busrouter.sg/data/2/stops.min.json';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { q, code } = req.query;

  let raw;
  try {
    const response = await fetch(STOPS_URL, { cache: 'force-cache' });
    if (!response.ok) {
      return error(res, `BusRouter SG stops returned status ${response.status}.`, 502);
    }
    raw = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach BusRouter SG. Please try again.', 502);
  }

  // raw is array of [code, name, lat, lng]
  let stops = raw.map(row => ({
    code: String(row[0]),
    name: row[1],
    lat:  row[2],
    lng:  row[3],
  }));

  // Filter by exact code lookup
  if (code) {
    const match = stops.find(s => s.code === code.trim());
    if (!match) {
      return res.status(404).json({
        success: false,
        message: `No bus stop found with code "${code}".`,
      });
    }
    return success(res, { stop: match });
  }

  // Filter by search query (name or code prefix)
  if (q) {
    const query = q.trim().toLowerCase();
    const isCode = /^\d+$/.test(query);
    stops = stops.filter(s =>
      isCode
        ? s.code.startsWith(query)
        : s.name.toLowerCase().includes(query)
    ).slice(0, 20);

    if (!stops.length) {
      return res.status(404).json({
        success: false,
        message: `No bus stops found matching "${q}".`,
      });
    }

    return success(res, { query: q.trim(), total: stops.length, stops });
  }

  // No filter — return full index as { code: name } map (lightweight)
  const index = {};
  for (const s of raw) index[String(s[0])] = s[1];

  return success(res, {
    total: Object.keys(index).length,
    index,
  });
};
