/**
 * Model of place
 */

// node modules
var mongoose = require('mongoose');

// enums grouped as static members of a class
// class Category {
//     //instances of class as static attributes
//     static Park = new Category("Park");
//     static Lake = new Category("Lake");
//     static Mountain = new Category("Mountain");
//     static City = new Category("City");
//     static Other = new Category("Other");
//
//     constructor(name) {
//         this.name = name;
//     }
//
//     toString() {
//         return `Category.${this.name}`;
//     }
// }

// schema: representation of the data
var placeSchema = mongoose.Schema({
    name:{type:String, required:true, unique:true},
    image:{type:String, required:false, unique:false},
    // category:{type:Category, default: Category.Other, required:false, unique:false},                //enums??
    category:{type:String, enum:['Park','Lake','Mountain','City','Other'], default: 'Other', required:false, unique:false},
    state:{type:String, required:false},
    country:{type:String, required:false},
    coords:{type:String, required:true},            //TODO: import Google Maps API stuff
    placeID:{type:String, required:false},           //TODO: import Google Maps API stuff
    userID:{type:mongoose.Schema.Types.ObjectId, required:true, unique:false},
    public:{type:Boolean, default:false, required:false, unique:false},
    createdAt:{type:Date, default:Date.now}
});

// model
var Place = mongoose.model('Place', placeSchema);

module.exports = Place;