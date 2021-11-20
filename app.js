const express = require('express');
const app = express();
const appError = require('.\\utils\\appError');
const globalErrorController = require('.\\controllers\\errorController');
const morgan = require('morgan');
const path = require('path');
const userRouter = require('.\\routers\\userRoute');
const viewRouter = require('.\\routers\\viewRoute');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); /// cac file static will begin with public folder

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/', viewRouter);
app.use('/users', userRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can not find ${req.originalUrl} on this server!!!`, 404));
});

app.use(globalErrorController);

module.exports = app;
