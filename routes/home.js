/**
 * Stores all routes for "/"
 */

var express = require('express');
var passport = require('passport');

// ensure authentication fn.
var ensureAuthenticated = require('../auth/auth').ensureAuthenticated;

// user model
var User = require('../models/user');

var router = express.Router();

/** Routes */
router.get('/', function(req, res){
    res.render('home/');
});

router.get('/about', function(req, res){
    res.render('home/about');
});

//TODO: remove this
// Maps API Key
const key = process.env.GOOGLE_API_KEY;
router.get('/test', function(req, res){
    res.render('home/test', {key:key});

});

router.get('/login', function(req, res){
    res.render('home/login');
});
router.post('/login', passport.authenticate('login', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}));

router.get('/logout', function(req, res){
    //logout
    req.logout(function(err){
        if (err) { return next(err); }
        //redirect
        res.redirect('/');
    });
});

router.get('/signup', function(req, res){
    res.render('home/signup');
});
router.post('/signup', function(req, res, next){
    //req body fields
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //check if user already exists (in DB)
    User.findOne({email: email}, function(err, user){
        if (err) { return next(err); }
        //user already exists (with specified email)
        if (user) {
            req.flash('error', 'There is already an account with this email!');
            return res.redirect('/signup');
        }

        //repassword is not the same as password
        if (repassword !== password) {
            req.flash('error', 'Repassword does not match.');
            return res.redirect('/signup');
        }

        //create new user object
        var newUser = new User({
            username:username,
            email:email,
            password:password
        });

        //save to DB
        newUser.save(next);
    });
}, passport.authenticate('login', {
    successRedirect:'/',
    failureRedirect:'/signup',
    failureFlash:true
}));

module.exports = router;