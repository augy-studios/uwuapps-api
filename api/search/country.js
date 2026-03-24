const { success, error, handleCors } = require('../../lib/response');

const RESTCOUNTRIES_URL = 'https://restcountries.com/v3.1/name/';

/**
 * Format a number with comma separators.
 * @param {number} n
 * @returns {string} e.g. "5,917,648"
 */
function formatPopulation(n) {
  return n.toLocaleString('en-US');
}

/**
 * Parse raw REST Countries v3.1 country object into a clean response shape.
 *
 * @param {object} c - Raw country object from REST Countries API
 * @returns {object}
 */
function parseCountry(c) {
  // Currencies: { SGD: { name: "Singapore Dollar", symbol: "$" }, ... }
  const currencies = c.currencies
    ? Object.entries(c.currencies).map(([code, val]) => `${val.name} - ${code}`)
    : [];

  // Languages: { eng: "English", msa: "Malay", ... }
  const languages = c.languages ? Object.values(c.languages) : [];

  return {
    name:       c.name?.common,
    officialName: c.name?.official,
    flag:       c.flags?.svg || c.flags?.png,
    capital:    c.capital?.[0] || null,
    continent:  c.continents?.[0] || null,
    region:     c.region || null,
    subregion:  c.subregion || null,
    population: formatPopulation(c.population),
    currencies,
    languages,
    tld:        c.tld?.[0] || null,
    callingCode: c.idd?.root
      ? `${c.idd.root}${(c.idd.suffixes || [])[0] || ''}`
      : null,
  };
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return error(res, 'Query parameter "q" is required (e.g. singapore).');
  }

  let data;
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_URL}${encodeURIComponent(q.trim())}?fullText=true`
    );
    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: `No country found for "${q}".`,
      });
    }
    if (!response.ok) {
      return error(res, `REST Countries API returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach REST Countries API. Please try again.', 502);
  }

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No country found for "${q}".`,
    });
  }

  return success(res, {
    query:   q.trim(),
    country: parseCountry(data[0]),
  });
};
