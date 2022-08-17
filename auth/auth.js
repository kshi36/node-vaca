/**
 * Middleware to check if user is logged in
 */

//middleware fn. to ensure auth
var ensureAuth = function ensureAuthenticated(req, res, next){      //usually middleware fns have "next" param
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('info', 'You must be logged in to see this page.');
        res.redirect('/login');
    }
}

//export fns (NodeJS)
module.exports = {
    ensureAuthenticated: ensureAuth
}