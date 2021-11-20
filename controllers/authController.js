const User = require('.\\..\\models\\userModel');
const catchAsyn = require('.\\..\\utils\\catchAsyn');
const appError = require('.\\..\\utils\\appError');
const multer = require('multer');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.login = catchAsyn(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError('Please, enter your email or password!!!', 400));

  const user = await User.findOne({ email: email }).select('+password'); // password feild have been hided, we cannot include it in findOne()
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new appError('Incorrect password or email !!!', 401));
  res.locals.user = user;
  createSendToken(user, 200, res);
});

exports.signup = catchAsyn(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      if (currentUser.passwordChanged(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsyn(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError('Please, log in before using this functionality!', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new appError('This user no longer exist!', 401));

  if (currentUser.passwordChanged(decoded.iat)) {
    return next(
      new appError('Password have changed, Please login again!!', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser; /// every template can use this

  next();
});

exports.updatePassword = catchAsyn(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Current password is wrong!!!', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
