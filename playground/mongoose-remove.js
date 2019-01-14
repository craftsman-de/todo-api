const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then( (result) =>{ 
//     console.log(result);
// });
//Todo.findOneAndRemove
Todo.findByIdAndRemove('5c3b30eef13a8921d5faac7e').then((todo) =>{
    console.log(todo);
});