const status = require('../config/constants')

module.exports = (response, success, code, data) => {
    response.json({
        success: success,
        messageCode: code,
        message: status.statusCodes[code],
        data: data
    })
}
