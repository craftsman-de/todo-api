
let {mongoose} = require('../db/mongoose');

let Todo = mongoose.model('Todo', {
    text:{  type: String, required:true, minlength:10, trim:true },
    completed:{ type: Boolean, default:false},
    completedAt:{ type: Number , default:null}
    });

module.exports = {Todo};  
// let newTodo = new Todo(
    //     {text:'cook dinner'});
    
    // newTodo.save().then((doc)=>{
    //     console.log('saved todo', doc);
    // }, (e) =>{ console.log('undable to save todo')});
    
    
    // let newtodo = [ 
    //     {text:'Play with the kittens', completed:false},
     
    //     {text:'Play with the Dog', completed:false},
       
    //     {text:'Play with the Afro', completed:false} ];
    // let  newtodo = new Todo({text:'  throw the biscuit in the bin       '});
    // newtodo.save().then((doc) => {
    //     console.log('saved todo', doc);
    // }, e => console.log('unable to save todo'))
    
    
    // Todo.insertMany(newtodo ).then((doc)=>{
    //     console.log(doc);
    // }, e=> {if(e)console.log('unable to save');});