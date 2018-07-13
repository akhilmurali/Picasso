let mongoose = require('mongoose');;
let bcrypt = require('bcrypt');
let userSchema = new mongoose.Schema({
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
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
});

userSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email: email}).exec(function(err, user){
        console.log(user);
        if(err){
            return callback(err);
        }else if(!user){
            let err = new Error('User Not Found');
            err.status = 401;
            return callback(err);
        }

        //If user found:
        bcrypt.compare(password, user.password, function(err, result){
            if(result == true){
                return callback(null, user);
            }else{
                return callback();
            }
        });
    });
}

let User = mongoose.model('User', userSchema);
module.exports = User;
