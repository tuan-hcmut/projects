const catchAsyn = require('.\\..\\utils\\catchAsyn');
const catchAysn = require('.\\..\\utils\\catchAsyn');

exports.getOverview = catchAysn(async (req, res, next) => {
  res.status(200).render('overview', {
    title: 'My Website',
  });
});

exports.loginForm = catchAysn(async (req, res, next) => {
  res.status(200).render('loginForm', {
    title: 'login',
  });
});

exports.signupForm = catchAysn(async (req, res, next) => {
  res.status(200).render('signupForm', {
    title: 'Sign up',
  });
});

exports.getAccount = catchAsyn(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Information',
  });
});

exports.sudokuGame = catchAsyn(async (req, res, next) => {
  res.status(200).render('sudoku', {
    title: 'Sudoku',
  });
});
