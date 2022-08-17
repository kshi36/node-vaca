/**
 * Stores all routes for "/profile"
 */

var express = require('express');

var router = express.Router();

// ensure authentication fn.
var ensureAuthenticated = require('../auth/auth').ensureAuthenticated;
router.use(ensureAuthenticated);

/** Routes */
router.get('/', function(req, res){
    res.render('profile/');
});

module.exports = router;