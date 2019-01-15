// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

let password = 'secret sauce';

// bcrypt.genSalt(10, (err, salt) =>{
//     bcrypt.hash(password, salt, (err,hash)=>{
//         console.log(hash);
//     })
// })

let hashedPass = '$2a$10$J16KNdsK9s/YHIhicp6Ox.Ffl2N.sRJy5Mn/WqKIflfTV3M5V5UJq';

bcrypt.compare(password, hashedPass, (err,res)=>{
    console.log(res);
})
// let data = {
//     id:10
// };
// let token = jwt.sign(data,'123abc');
// console.log(token);

// let decoded = jwt.verify(token, '123abc');
// console.log(decoded);


// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log('Message:'+message);
// console.log('Hash:'+hash);

// let data = {
//     id:4
// }
// let token={
//     data,
//     hash:SHA256(JSON.stringify(data)).toString();
// }
// let resultHash=SHA256(JSON.stringify(token.data) + 'some secret').toString();

// if(resultHash === token.hash){
//     console.log('data was not changed');
// }else{
//     console.log('data was changed , do not trust!');
//}