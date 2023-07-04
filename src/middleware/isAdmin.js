const throwError = require('../utils/createError');


module.exports = async (request, response, next) => {
    try {
        const user_type = request.userInfo.type
        if (user_type === 'admin')
            next();
        else
            throw throwError(request, 401, {}, 203)
    }
    catch (error) {
        next(error);
    }
}