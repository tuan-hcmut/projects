const express = require('express');
const authController = require('.\\..\\controllers\\authController');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  usersController.userPhoto,
  usersController.resizeUserPhoto,
  usersController.updateMe
);

module.exports = router;
