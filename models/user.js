var mongoose = require('mongoose');
const validator = require('validator');
//const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minLenght: 1,
        trim: true,
        defualt: '-'
    },
    email:{
        type:String,
        required: true,
        minLenght: 1,
        trim: true,
        defualt: '-',
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minLenght: 6
    },
    tokens: [{
        access:{
            type: String,
            reuired: true
        },
        token:{
            type: String,
            reuired: true
        }
    }],
    completedAt:{
        type:Date,
        default: Date.now
    }

});

//Override of JSON method
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','name','tokens.token','email'])
};

//instance method
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'x-auth';
    var token = jwt.sign({_id: user._id.toHexString(),access},'MySecretValue').toString();
    user.tokens = user.tokens.concat([{access,token}]);  
    return user.save().then(()=>{
        //console.log(token);
        return token;
    });
};

//static method...this is why the up[per case]
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token,'MySecretValue');
    } catch (e) { 
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'x-auth'
    });
};


var User = mongoose.model('User',UserSchema);
module.exports = {User};
