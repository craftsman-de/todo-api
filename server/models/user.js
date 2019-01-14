const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {mongoose} = require('../db/mongoose');
const validator = require('validators');
    
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

    return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id:user._id.toHexString(), access:access}, 'secret sauce')

    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(()=>{
        return token;
    })
}
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try{
        decoded = jwt.verify(token, 'secret sauce');
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
module.exports.User = new mongoose.model('User', UserSchema);
    
    // let user = new User({firstName:'bob'});
    
    // user.save().then((doc)=> {
    //     console.log('user created',doc);
    // }, e => console.log('user insert failed', e));
    
    