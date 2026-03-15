const {
    runEncode,
    ENCODE_ALGORITHMS
} = require('../../lib/encode');
const {
    success,
    error,
    handleCors
} = require('../../lib/response');

module.exports = (req, res) => {
    if (handleCors(req, res)) return;

    const {
        alg,
        text,
        mode
    } = req.query;

    if (!alg) {
        return error(res, 'Query parameter "alg" is required. Available: ' + Object.keys(ENCODE_ALGORITHMS).join(', '));
    }
    if (text == null) {
        return error(res, 'Query parameter "text" is required.');
    }

    const m = (mode || 'encode').toLowerCase();
    if (m !== 'encode' && m !== 'decode') {
        return error(res, '"mode" must be "encode" or "decode".');
    }

    const opts = Object.assign({}, req.query);
    delete opts.alg;
    delete opts.text;
    delete opts.mode;

    const result = runEncode(alg.toLowerCase(), text, m, opts);
    if (result.error) return error(res, result.error);
    return success(res, result);
};