const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos', (req,res)=>{
    let todo = new Todo({text:req.body.text});

    todo.save().then((doc)=>{
        res.send(doc);
    }, e=> {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req,res)=>{
    let id = req.params.id;
    if(ObjectID.isValid(id)){
        Todo.findById(id).then((todo) => {
            if(todo)
                res.send( {todo} );
            else
                res.status(404).send('No user with that ID found');
        }).catch(e=>console.log(e));
    }else
        res.status(404).send("Invalid ID");

});

app.get('/todos', (req,res)=>{
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', (req, res) =>{
    let id = req.params.id;
    if(ObjectID.isValid(id)){
        Todo.findByIdAndRemove(id).then( (response) =>{
            if(response){
                res.status(200).send(response + 'deleted')
            }else{
                res.status(400).send('Couldnt find anything with that id')
            }
        }).catch(e=>console.log('Error caught :'+e))

    }else{
        res.status(404).send('Invalid ID')
    }


})

app.listen(port, ()=>{
    console.log('started on port '+port);
});

module.exports = {app};