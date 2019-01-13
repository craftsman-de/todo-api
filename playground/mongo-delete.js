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
    const obj = new ObjectID("5c396cdbd29e9017c45e531f");
   db.collection('Users').findOneAndDelete({_id:obj}).then((result) =>{
       console.log(result);
   });
  
    //client.close();
}); 
    
 