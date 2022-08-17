/**
 * Set up router for "/"
 */

var express = require('express');
var router = express.Router();
router.use(function(req, res, next){      //next: move on to next line (in this file)
    //add locals
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');    //error msgs
    res.locals.info = req.flash('info');   //info msgs

    next();
});

/** Routes (from other files) */
router.use('/', require('./home'));
router.use('/places', require('./place'));
router.use('/map', require('./map'));
router.use('/profile', require('./profile'));
// router.use('/posts', require('./post'));  //think: for router, the url goes like /posts/[value of require()]

module.exports = router;