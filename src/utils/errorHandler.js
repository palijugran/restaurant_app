const errorHandler = (error, request, response, next) => {
    if (!request.code) {
        request.code = 400;
        request.err = {};
    }
    response.status(request.code).json({
        status: 'failure',
        statusCode: request.code,
        message: error.message,
        data: request.err
    })
}

module.exports = errorHandler;