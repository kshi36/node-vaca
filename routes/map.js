/**
 * Stores all routes for "/map"
 */

var express = require('express');

var router = express.Router();

/** Routes */
router.get('/', function(req, res){
   res.render('map/');
});

module.exports = router;