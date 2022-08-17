/**
 * Model of user
 */
// node modules
var bcrypt = require('bcryptjs');    //hash passwds
var mongoose = require('mongoose');

// consts
const SALT_FACTOR = 10;

// schema: representation of the data
var userSchema = mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
});

// pre middleware fn.
userSchema.pre('save', function(done){      //pre: before user is saved
    var user = this;

    //password not modified
    if (!user.isModified('password')){
        return done();
    }

    //generate salt
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if (err) { return done(err); }

        //hash the password
        bcrypt.hash(user.password, salt, function(err, hashedPassword) {
            if (err) { return done(err); }

            user.password = hashedPassword;
            done();
        });
    });
});

// check password fn.
userSchema.methods.checkPassword = function(guess, done){
    //if password was supplied
    if (this.password != null) {
        bcrypt.compare(guess, this.password, function(err, isMatch){
            done(err, isMatch);
        });
    }
}

// model
var User = mongoose.model('User', userSchema);

module.exports = User;