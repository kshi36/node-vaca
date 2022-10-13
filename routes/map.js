/**
 * Stores all routes for "/map"
 */

var express = require('express');

// ensure authentication fn.
var ensureAuthenticated = require('../auth/auth').ensureAuthenticated;

var router = express.Router();

// Maps API Key
const key = process.env.GOOGLE_API_KEY;

// use ensure authentication fn. for entire route of "/map" (so don't need middleware for every router fn.)
router.use(ensureAuthenticated);

/** Routes */
router.get('/', function(req, res){
   res.render('map/', {key:key});
});

module.exports = router;