const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

global.APP_PATH = path.resolve(__dirname);
global.roles = {manager: 1, developer: 0};
const helpers = require(APP_PATH + '/libs/helpers');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(require('cors')());

app.use(function (req, res, next) {
	helpers.trim(req.query);
	helpers.trim(req.body);
	next();
});

app.use('/api', require('./api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json(err);
});

module.exports = app;