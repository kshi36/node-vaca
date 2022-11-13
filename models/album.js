/**
 * Model of album (collection of photos)
 */

// node modules
var mongoose = require('mongoose');

// schema: representation of the data
var albumSchema = mongoose.Schema({
    photos:[{type:String, required:false}],  //URL of images
    modelID:{type:mongoose.Schema.Types.ObjectId, //links to a Place object
        required:false, unique:true},
    userID:{type:mongoose.Schema.Types.ObjectId, required:true, unique:false},
    public:{type:Boolean, default:false, required:false, unique:false},
    createdAt:{type:Date, default:Date.now, required:false}
});

// model
var Album = mongoose.model('Album', albumSchema);

module.exports = Album;