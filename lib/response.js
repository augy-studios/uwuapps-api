/**
 * Standardised API response helpers
 */

function success(res, data, status = 200) {
    return res.status(status).json({
        success: true,
        ...data
    });
}

function error(res, message, status = 400) {
    return res.status(status).json({
        success: false,
        error: message
    });
}

function methodNotAllowed(res, allowed = 'GET') {
    res.setHeader('Allow', allowed);
    return error(res, `Method not allowed. Use ${allowed}.`, 405);
}

module.exports = {
    success,
    error,
    methodNotAllowed
};