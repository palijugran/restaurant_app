const express = require('express');
const path = require('path');
const apis = require('./routes/api');
const throwError = require('./utils/createError');
const errorHandler = require('./utils/errorHandler');

module.exports = (app) => {

    app.use(express.json({}));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, 'files')));

    app.use('/api/v1', apis);

    app.use('/', (request, response, next) => {
        console.log("Page not found");
        throw throwError(request, 404, {}, 200);
    })

    app.use(errorHandler);
}