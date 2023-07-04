const AuthService = require('../service/authService');
const jwt = require('jsonwebtoken');


exports.createToken = async (user, request, response, next) => {
    try {
        const payload = {
            userId: user.id,
            email: user.email,
            type: user.type
        }
        const accesstoken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5h'
        });
        const refreshtoken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
        const data = {
            userId: user.id,
            refresh_token: refreshtoken
        }
        const refreshTokenCreated = await AuthService.createRefreshToken(data);
        if (refreshTokenCreated) {
            const token = { accesstoken, refreshtoken };
            return token;
        }

    } catch (error) {
        console.log(error);
        // next(error)
    }
}