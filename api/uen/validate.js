const {
    validate
} = require('../../lib/uen');
const {
    success,
    error,
    methodNotAllowed
} = require('../../lib/response');

/**
 * GET /api/uen/validate?uen=T08LL0001A
 *
 * Query parameters:
 *   uen — the UEN string to validate (required)
 */
module.exports = function handler(req, res) {
    if (req.method !== 'GET') {
        return methodNotAllowed(res, 'GET');
    }

    const {
        uen
    } = req.query;

    if (!uen) {
        return error(res, 'uen query parameter is required.');
    }

    const result = validate(uen);
    return success(res, result);
};