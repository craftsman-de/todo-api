const {ObjectID} = require('mongodb');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id:userOneId,
    email:'donkey@example.com',
    password:'useronepass',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userOneId.toHexString(), access:'auth'}, 'secret sauce')}]
        
    },{
     _id:userTwoId,
    email:'userTwo@weaner.com',
    password:'usertwopass'
}] 

const todos = [
    {_id:new ObjectID(), text:'first test todo', completed:true, completedAt:new Date().getTime() },
    {_id:new ObjectID(), text:'second test todo',completed:false, completedAt:null }
];


const populateTodos =  (done) =>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then( () => done());
};
const populateUsers = (done)=> {
    User.remove({}).then(() =>{
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(()=>done());
};
module.exports = {todos, populateTodos,users,populateUsers};