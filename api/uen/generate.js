const {
    generate,
    ENTITY_TYPE_INDICATORS,
    VALID_PREFIXES
} = require('../../lib/uen');
const {
    success,
    error,
    methodNotAllowed
} = require('../../lib/response');

const MAX_COUNT = 50;

/**
 * GET /api/uen/generate
 *
 * Query parameters:
 *   type       — "A", "B", or "C" (optional, random if omitted)
 *   count      — number of UENs to generate, 1–50 (default: 1)
 *   year       — year for Type B (4-digit) or Type C (2-digit) (optional)
 *   prefix     — "T", "S", or "R" for Type C (optional)
 *   entityType — entity type indicator for Type C, e.g. "LP" (optional)
 */
module.exports = function handler(req, res) {
    if (req.method !== 'GET') {
        return methodNotAllowed(res, 'GET');
    }

    const {
        type,
        count: rawCount,
        year: rawYear,
        prefix,
        entityType
    } = req.query;

    // ── Validate count ────────────────────────────────────
    const count = rawCount ? parseInt(rawCount, 10) : 1;
    if (isNaN(count) || count < 1 || count > MAX_COUNT) {
        return error(res, `count must be a number between 1 and ${MAX_COUNT}.`);
    }

    // ── Validate type (if provided) ───────────────────────
    if (type && !['A', 'B', 'C'].includes(type.toUpperCase())) {
        return error(res, 'type must be "A", "B", or "C".');
    }

    // ── Validate prefix (if provided) ─────────────────────
    if (prefix && !VALID_PREFIXES.includes(prefix.toUpperCase())) {
        return error(res, `prefix must be one of: ${VALID_PREFIXES.join(', ')}.`);
    }

    // ── Validate entityType (if provided) ─────────────────
    if (entityType && !ENTITY_TYPE_INDICATORS.includes(entityType.toUpperCase())) {
        return error(res, `entityType must be one of: ${ENTITY_TYPE_INDICATORS.join(', ')}.`);
    }

    // ── Validate year (if provided) ───────────────────────
    let year;
    if (rawYear !== undefined) {
        year = parseInt(rawYear, 10);
        if (isNaN(year) || year < 0) {
            return error(res, 'year must be a non-negative number.');
        }
    }

    // ── Build options ─────────────────────────────────────
    const options = {};
    if (year !== undefined) options.year = year;
    if (prefix) options.prefix = prefix.toUpperCase();
    if (entityType) options.entityType = entityType.toUpperCase();

    // ── Generate ──────────────────────────────────────────
    try {
        if (count === 1) {
            const result = generate(type || undefined, options);
            return success(res, result);
        }

        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(generate(type || undefined, options));
        }
        return success(res, {
            results,
            count
        });
    } catch (err) {
        return error(res, err.message);
    }
};