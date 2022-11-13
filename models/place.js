/**
 * Model of place
 */

// node modules
var mongoose = require('mongoose');

// schema: representation of the data
var placeSchema = mongoose.Schema({
    name:{type:String, required:true, unique:false},
    image:{type:String, required:false, unique:false},
    photos:[{type:String, required:false}],  //URL of images  TODO: move to new schema?
    category:{type:String, enum:['Park','Lake','Mountain','City','University','Attraction','Other'], default: 'Other', required:false, unique:false},
    state:{type:String, required:false},
    country:{type:String, required:false},
    coords:{type:{lat:Number, lng:Number}, required:true},
    placeID:{type:String, required:true, unique:false},
    userID:{type:mongoose.Schema.Types.ObjectId, required:true, unique:false},
    public:{type:Boolean, default:false, required:false, unique:false},
    createdAt:{type:Date, default:Date.now}
});

// model
var Place = mongoose.model('Place', placeSchema);

module.exports = Place;