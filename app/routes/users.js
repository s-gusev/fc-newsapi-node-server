// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
var passport = require('passport');
const router = express.Router();
const { UsersController } = require('../controllers/users-controller');
const usersController = new UsersController();
const jwt = require('jsonwebtoken');

router.get('/login', usersController.login);
router.get('/logout', usersController.logout);
router.get('/signup', usersController.signup);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));
router.post('/signup', usersController.register);

module.exports = router;

router.post('/api/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Invalid username or password',
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign({ id: user.id }, 'jwtAuthSecret');
            return res.json({ token });
        });
    })(req, res);
});