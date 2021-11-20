const crypto = require('crypto'); // 134
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'yourName'],
  },
  email: {
    type: String,
    require: [true, 'yourEmail'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, provide valid Email!!!!'],
  },
  photo: {
    type: String,
    default: 'cat.png',
  },
  password: {
    type: String,
    require: [true, 'Please, provide your Password!!!'],
    minlength: 8,
    select: false, /// never show up password when output
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please, confirm your password!!!'],
    validate: {
      validator: function (el) {
        /// it will be call when doc is created. And it just run when we save() create()
        return el === this.password;
      },
      message: 'Password is not same!!',
    },
  },

  passwordChangeAt: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(/^find/, async function (next) {
  this.find({
    active: { $ne: false },
  });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); /// check if user just change his email not password

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTime = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTime;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
