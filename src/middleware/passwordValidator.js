const { check, validationResult } = require('express-validator');
const throwError = require('../utils/createError');
exports.authValid = [
    check('email').isEmail().exists({ checkFalsy: true }).withMessage("You must enter a valid email address"),
    check('password', "Password should be min 8 characters long with atleast one special char and one digit")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .exists({ checkFalsy: true }).withMessage('You must enter a password'),
]

exports.validator = (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            const err = errors.array();
            throw throwError(request, 403, err, 202)
        }
        next();
    } catch (error) {
        next(error);
    }
}