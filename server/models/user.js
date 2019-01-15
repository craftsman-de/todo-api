const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {mongoose} = require('../db/mongoose');
const validator = require('validators');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema( {
    firstName: { type:String, default:'Jim', minlength:1, trim:true},

    lastName: { type:String, default:'Jones', minlength:1, trim:true},

   email: {type:String, required:true, minlength:1, trim:true, unique:true,
   validate: {  validator:(value) => validator.isEmail, message:'{VALUE} is not a valid email' }},
    
   password: { type:String, required:true, minlength:8 },

   tokens:[ { access:{type:String, required:true }, token:{type:String, required:true} }],

   location: {type:String, default:'Sludgetown', trim:true}
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'firstName'])
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id:user._id.toHexString(), access:access}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(()=>{
        return token;
    })
}
UserSchema.methods.removeToken = function(token) {
    let user = this;
    return user.update({ $pull:{tokens:{token:token}}});
}
UserSchema.statics.findByCredentials = function(email,password)  {
    var User = this;
    
    return User.findOne({email}).then(user=>{
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password, user.password, (err,res) =>{
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            })
        })
    })

}
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        // return new Promise((resolve,reject) =>{
        //     reject();
        // });
        return Promise.reject();
    }
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}
UserSchema.pre('save', function (next) {
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(user.password, salt, (err,hash)=>{
               user.password = hash;
                next();
           });
       });
       
    }else{
  
        
        next();
    }
});
module.exports.User = new mongoose.model('User', UserSchema);
    
    // let user = new User({firstName:'bob'});
    
    // user.save().then((doc)=> {
    //     console.log('user created',doc);
    // }, e => console.log('user insert failed', e));
    
    