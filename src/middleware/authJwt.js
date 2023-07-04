const jwt = require('jsonwebtoken');
const throwError = require('../utils/createError');


module.exports = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw throwError(request, 404, {}, 600);
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err instanceof jwt.TokenExpiredError) {
                throw throwError(request, 401, {}, 601);
            }
            else if (err) {
                throw throwError(request, 401, {}, 602);
            }
            request.userInfo = decoded;
            next();
        })
    } catch (error) {
        next(error);
    }
}