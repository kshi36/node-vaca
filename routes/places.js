/**
 * Stores all routes for "/places"
 */

var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

// ensure authentication fn.
var ensureAuthenticated = require('../auth/auth').ensureAuthenticated;

// place model
var Place = require('../models/place');

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

// use ensure authentication fn. for entire route of "/places" (so don't need middleware for every router fn.)
router.use(ensureAuthenticated);

/** Routes */
// full list of places page
router.get('/', async function(req, res){
    //get all categories (each a list of places) from db
    const Categories = {
        Park: 'Park',
        Lake: 'Lake',
        Mountain: 'Mountain',
        City: 'City',
        University: 'University',
        Attraction: 'Attraction',
        Other: 'Other'
    };

    //object to store categories list
    var categoryList = {};

    //TODO: fix await code?
    await Object.keys(Categories).reduce(async (memo, category) => {
        await memo;
        const places = await Place.find({userID: req.user._id, category: category});
        // console.log('size: ' + places.length);
        if (places.length !== 0) categoryList[category] = places;
        // console.log('contents: ' + categoryList[category]);

    }, undefined);

    // console.log('preparing to render places.ejs...');

    //render "places.ejs" and pass in categories object
    res.render('places/',{categories: categoryList});
});

// add place page
// router.get('/add', function(req, res){
//     res.render('places/addplace');
// });
//TODO: upload image
router.post('/add', upload.single('placeimage'), async function(req, res){

    console.log('req body: ' + JSON.stringify(req.body));
    // console.log('place coords (in router): ' + req.body.placecoords + ', type: ' + typeof req.body.placecoords);

    //TODO: validate form fields
    var placecoords = JSON.parse(req.body.placecoords);

    //TODO: test different users can save same place
    const dbPlace = await Place.findOne(
        {userID: req.user._id, placeID: req.body.placeid}).
                exec(); //exec used to return Promise (unnecessary here)
    if (dbPlace) {
        console.log('New place is in DB, cancelling request...');
        // req.flash('error', 'Place already added!');      //TODO: flash
        res.sendStatus(204);
    }
    else {

        console.log('New place is not in DB, adding to DB...');

        //new mongoose place object
        var newPlace = new Place({
            name: req.body.placename,
            photos: [],
            category: req.body.placetag,
            coords: placecoords,
            placeID: req.body.placeid,
            userID: req.user._id,         //from MongoDB db
        });

        //save place into MongoDB
        newPlace.save(function(err, place){
            if (err) {
                console.log(err);
            }      //TODO: change to flash
            // res.redirect('/places');
            res.sendStatus(204);
        });

        // const savedPlace = await Place.findById(req.body.placeid);
        //
        // //new mongoose album object
        // var newAlbum = new Album({
        //     photos: [],
        //     modelID: savedPlace._id,
        //     userID: req.user._id
        // });
        //
        // //save album associated w/ place into MongoDB
        // newAlbum.save(function(){
        //     if (err) {
        //         console.log(err);
        //     }      //TODO: change to flash
        //     res.sendStatus(204);
        // });
    }
});

// get single place      : - route param (can be anything, often is an id)
router.get('/album/:placeId', function(req, res){
    //get place with id of placeId
    Place.findById(req.params.placeId).exec(function(err, place){
        //render album.ejs and pass in place object
        res.render('places/album', {place:place});
    });
});

// edit single place page
router.get('/album/edit/:placeId', function(req, res){
    //get place with id of placeId
    Place.findById(req.params.placeId).exec(function(err, place){
        //render editalbum.ejs and pass in place object
        res.render('places/editalbum', {place:place});
    });
});
router.post('/album/update', upload.array('newfiles'), async function(req, res){
    //save/cancel paths
    if (req.body.submitbtn === 'canceled') {
        console.log('update album canceled...');
        res.redirect('/places/album/' + req.body.placeid);
    }
    else {
        console.log('update album confirmed...');
        //asynchronously find place by id
        const place = await Place.findById(req.body.placeid);
        if (!place.photos) place.photos = [];       //initialize photos list

        //TODO: test
        //update place's album (photos list)
        const files = req.files;        //req.files is array from "upload.array()"

        if (req.body.photos?.length) {
            const newFilesLength = parseInt(req.body.newfileslength);
            const offset = req.body.photos.length-newFilesLength;

            //preprocess photos array to update DB
            const photosInput = req.body.photos.map((photo) => JSON.parse(photo))
            for (let i=0; i<newFilesLength; i++) {
                photosInput[i+offset].url = '/' + files[i].path;
            }
            //set (new) photos array in DB
            place.set('photos', photosInput);
        }

        //asynchronously save album
        try {
            let savePlace = await place.save();
            console.log('saved place ', savePlace);
            res.redirect('/places/album/' + req.body.placeid);      //redirect to single place
        } catch (err) {
            console.log("error happen", err);        //TODO: refine
            res.status(500).send(err);
        }
    }
});

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