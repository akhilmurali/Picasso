let mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    }
});

//Hash the password prior to saving it:
userSchema.pre('save',function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
});

let User = mongoose.model('User', userSchema)

module.exports = User;