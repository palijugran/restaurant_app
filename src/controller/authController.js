const authService = require('../service/authService');
const bcrypt = require('bcrypt')
const responder = require('../utils/responder');
const throwError = require('../utils/createError');
const jwt = require('../utils/jwt')
const jwtToken = require('jsonwebtoken');

exports.register = async (request, response, next) => {
    try {
        const { type, username, email, password, phoneNumber } = request.body
        const existingUser = await authService.findUser(email);
        if (existingUser) {
            throw throwError(request, 409, {}, 300);
        }
        const data = {
            type,
            username,
            email,
            password: await bcrypt.hash(password, 12),
            phoneNumber
        }
        const userCreated = await authService.createUser(data);
        if (!userCreated) {
            throw throwError(request, 400, {}, 301);
        }
        return responder(response, true, 302, {})

    } catch (error) {
        console.log(error)
        next(error)
    }
}
exports.login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        const user = await authService.findUser(email);
        if (!user) {
            throw throwError(request, 404, {}, 303)
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            throw throwError(request, 401, {}, 304);
        }
        const token = await jwt.createToken(user);
        const data = {
            id: user.id,
            email: user.email,
            access_token: token.accesstoken,
            refresh_token: token.refreshtoken
        }
        return responder(response, true, 201, data);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.refreshToken = async (request, response, next) => {
    try {
        authHeader = request.headers.authorization;
        if (!authHeader) {
            throw throwError(request, 401, {}, 600);
        }
        const refreshToken = authHeader.split(' ')[1];
        const token = await authService.findToken(refreshToken);
        if (!token) {
            throw throwError(request, 401, {}, 603);
        }

        jwtToken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            let payload = {
                userId: decoded.userId,
                email: decoded.email
            }
            if (err) {
                throw throwError(request, 401, {}, 602);
            }
            let accesstoken = jwtToken.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' })
            return responder(response, true, 604, { accesstoken });
        })
    } catch (error) {
        next(error);
    }
}