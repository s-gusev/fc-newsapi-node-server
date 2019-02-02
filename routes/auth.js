const express = require('express');
var passport = require('passport');
const router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

module.exports = router;
