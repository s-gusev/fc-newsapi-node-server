// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
var passport = require('passport');
const router = express.Router();
const { UsersController } = require('../controllers/users-controller');
const usersController = new UsersController();
const pauth = passport.authenticate.bind(passport);

router.get('/login', usersController.login);
router.get('/logout', usersController.logout);
router.get('/signup', usersController.signup);

router.post('/login', pauth('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));
router.post('/signup', usersController.register);

module.exports = router;
