const express = require('express');
const viewController = require('.\\..\\controllers\\viewController');
const authController = require('.\\..\\controllers\\authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/login', authController.isLoggedIn, viewController.loginForm);
// router.get('/logout', authController.isLoggedIn, viewController.getOverview);
router.get('/signup', authController.isLoggedIn, viewController.signupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/games/sudoku', authController.protect, viewController.sudokuGame);

module.exports = router;
