'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

class UsersController {
    login(req, res, next) {
        res.render('users/login', { title: 'Login', errmsg: req.flash('error') });
    }

    logout(req, res, next) {
        req.logout();
        res.redirect('/users/login');
    }

    signup(req, res, next) {
        res.render('users/signup', { title: 'Sign up' });
    }

    register(req, res, next) {
        const user = new User(req.body);
        // user.provider = 'local';
        user.save()
            .then(user => {
                req.logIn(user, err => {
                    if (err) req.flash('info', 'Sorry! We are not able to log you in!');
                    return res.redirect('/');
                })
            })
            .catch((err) => {
               res.render('users/signup', {
                    title: 'Sign up',
                    errmsg: err.errmsg,
                    user
                });
            });
    }
}

module.exports = {
    UsersController: UsersController
}