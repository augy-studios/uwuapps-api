const { success, error, handleCors } = require('../../lib/response');

const ARRIVALS_URL = 'https://arrivelah2.busrouter.sg/';

/**
 * Parse duration_ms into human-readable minutes string.
 * @param {number|null} ms
 * @returns {string}
 */
function msToMins(ms) {
  if (ms == null) return null;
  const sec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m > 0) return s ? `${m}m ${s}s` : `${m} min${m > 1 ? 's' : ''}`;
  return `${s}s`;
}

/**
 * Parse a bus arrival entry (next/subsequent).
 * @param {object|null} bus
 * @returns {object|null}
 */
function parseBus(bus) {
  if (!bus) return null;
  return {
    eta:        msToMins(bus.duration_ms),
    durationMs: bus.duration_ms ?? null,
    load:       bus.load        ?? null,  // SEA / SDA / LSD
    type:       bus.type        ?? null,  // SD / DD / BD
    feature:    bus.feature     ?? null,  // WAB
  };
}

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { code } = req.query;
  if (!code || !/^\d{5}$/.test(code.trim())) {
    return error(res, 'Query parameter "code" must be a 5-digit bus stop code (e.g. 83139).');
  }

  let data;
  try {
    const url = `${ARRIVALS_URL}?id=${encodeURIComponent(code.trim())}&rand=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return error(res, `BusRouter SG returned status ${response.status}.`, 502);
    }
    data = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach BusRouter SG. Please try again.', 502);
  }

  const services = (data.services || []).map(s => ({
    serviceNo: s.no || s.service_no || s.ServiceNo || '?',
    next:       parseBus(s.next       || s.next_bus),
    subsequent: parseBus(s.subsequent || s.subsequent_bus),
    subsequent2: parseBus(s.subsequent2 || s.subsequent_bus2),
  }));

  return success(res, {
    stopCode: code.trim(),
    fetchedAt: new Date().toISOString(),
    services,
  });
};
