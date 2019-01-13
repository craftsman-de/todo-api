    let {mongoose} = require('../db/mongoose');
    
    
module.exports.User = new mongoose.model('User', {
         firstName: { type:String, default:'Jim', minlength:1, trim:true},
         lastName: { type:String, default:'Jones', minlength:1, trim:true},
        email: {type:String, required:true, minlength:1, trim:true},
         location: {type:String, default:'Sludgetown', trim:true}
    });
    
    // let user = new User({firstName:'bob'});
    
    // user.save().then((doc)=> {
    //     console.log('user created',doc);
    // }, e => console.log('user insert failed', e));
    
    