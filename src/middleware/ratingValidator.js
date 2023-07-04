const throwError = require('../utils/createError')

module.exports = async (request, response, next) => {
    try {
        const { stars } = request.body
        if (stars > 5 || stars < 0) {
            throw throwError(request, 409, {}, 411)
        }

        next()
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}