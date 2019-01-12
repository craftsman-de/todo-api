//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=> {
    if(err){
        return console.log('Unable to connect to MongoDB server!');
    }
    console.log('Connected to mongoDB server');
    const db = client.db('TodoApp');
    // db.collection('Users').find({name:'Peter'}).toArray().then((count)=>{
    //  //   console.log('Number of Peters count: ' +count);
     
    //     console.log(JSON.stringify(count, undefined, 2));
    // }, (err) => {
    //     console.log('unable to fetch users ', err);
    // });
    db.collection('Users').find({name:'Peter'}).toArray().then((arr) =>{
        arr.forEach(x=>console.log(x.name));
    }, (err) =>{
        console.log('error');
    
    });
    //client.close();
}); 
    
    //const db = client.db('TodoApp');
     // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed:false
    // }, (err,result)=> {
    //     if(err){
    //         return console.log('Unable to insert todo ',err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    // db.collection('Users').insertOne({
    //     name:'Donkey',
    //     age:49,
    //     location:'Detroit'
    // }, (err,result) =>{
    //     if(err){
    //         return console.log('Error inserting');
    //     }
    //     console.log(result.ops[0]._id.getTimestamp());
    // });
