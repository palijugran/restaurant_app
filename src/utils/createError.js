const status = require('../config/constants')

module.exports = (request, code, err, messageCode) => {
    request.code = code;
    request.err = err;
    const errorMessage = status.statusCodes[messageCode];
    return new Error(errorMessage);
}