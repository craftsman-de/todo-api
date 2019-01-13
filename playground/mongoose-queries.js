const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

let id = '5c3aa76e5b2d9133344b0772';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}
else
    User.findById(id).then((user)=>{
       if(user)console.log(user);
       else
        return console.log("user not found");
    }).catch(e=>console.log(e));

// Todo.find({
//     _id:id
// }).then((todos) => {
//     console.log('Todos',todos);
// });

// Todo.findOne({
//     _id:id
// }).then((todo) => {
//     console.log('Todo',todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('id not found');
//     }
//     console.log('Todo by id',todo);
// }).catch((e)=> console.log(e));