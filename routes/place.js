/**
 * Stores all routes for "/place"
 */

var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

// ensure authentication fn.
var ensureAuthenticated = require('../auth/auth').ensureAuthenticated;

// place model
var Place = require('../models/place');
const mongoose = require("mongoose");

var router = express.Router();

// multer config (where to store files/what names for the file)
var storage = multer.diskStorage({
    destination:'./uploads/images/',
    filename:function(req, file, cb){
        //make random byte string (16) + current date + extension name of original file
        crypto.pseudoRandomBytes(16, function(err, raw){     //assume no errors (null)
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname))
        });
    }
});
var upload = multer({storage:storage});     //used in route to upload file

// use ensure authentication fn. for entire route of "/place" (so don't need middleware for every router fn.)
router.use(ensureAuthenticated);

/** Routes */
// full list of places page
router.get('/', function(req, res){
    //get all places from db
    Place.find({userID: req.user.id}).exec(function(err, places){
        if (err) { console.log(err); }  //TODO: change to flash

        //render "places.ejs" and pass in places object
        res.render('place/places', {places:places});
    });
});

// add place page
// router.get('/add', function(req, res){
//     res.render('place/addplace');
// });
router.post('/add', upload.single('image'), function(req, res){

    //TODO: validate form fields
    var place_coords = JSON.parse(req.body.placecoords);

    // console.log('place coords (in router): ' + place_coords + ', type: ' + typeof place_coords)

    var newPlace;
    //image chosen
    // if (req.file) {
    //     newPlace = new Place({
    //         // title: req.body.title,
    //         // content: req.body.content,
    //         // image: req.file.path,
    //
    //         name: req.body.placename,
    //         category: req.body.placetag,
    //         coords: req.body.placecoords,
    //         placeID: req.body.placeid,
    //         userID: req.user._id,         //from MongoDB db
    //     });
    // }
    // else {
    newPlace = new Place({
        name: req.body.placename,
        category: req.body.placetag,
        coords: place_coords,
        placeID: req.body.placeid,
        userID: req.user._id,         //from MongoDB db
    });
    // }

    newPlace.save(function(err,place){
        if (err) { console.log(err); }      //TODO: change to flash
        // res.redirect('/places');
        res.sendStatus(204);
    });
});

// // get single place      : - route param (can be anything, often is an id)
// router.get('/:placeId', function(req, res){
//     //get place with id of placeId
//     Place.findById(req.params.placeId).exec(function(err, place){
//         //render detailplace.ejs and pass in place object
//         res.render('place/detailplace', {place:place});
//     });
// });
//
// // edit single place page
// router.get('/edit/:placeId', function(req, res){
//     //get place with id of placeId
//     Place.findById(req.params.placeId).exec(function(err, place){
//         //render editplace.ejs and pass in place object
//         res.render('place/editplace', {place:place});
//     });
// });
// router.post('/update', upload.single('image'), async function(req, res){
//     //asynchronously find place by id
//     const place = await Place.findById(req.body.placeid);
//
//     //update place
//     place.title = req.body.title;
//     place.content = req.body.content;
//     if (req.file)
//         place.image = req.file.path;
//
//     //asynchronously save place
//     try {
//         let savePlace = await place.save();
//         console.log("saved place ", savePlace);
//         // res.redirect('/places/' + req.body.placeid);      //redirect to single place
//         res.redirect('/places');      //redirect to list of places
//     }
//     catch (err) {
//         console.log("error happen");        //TODO: refine
//         res.status(500).send(err);
//     }
// });
//
// // delete single place
// router.post('/delete/:placeId', function(req, res){
//     //delete place
//     // Place.deleteOne(function(req, res){
//     //
//     // });
//     // Place.findByIdAndDelete();
//     Place.deleteOne({_id:req.params.placeId}, function(err,place){
//         if (err) { console.log(err); }      //TODO: change to flash
//         res.redirect('/places');
//     });
// });

// export router
module.exports = router;