//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=> {
    if(err){
        return console.log('Unable to connect to MongoDB server!');
    }
    console.log('Connected to mongoDB server');
    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({
        name:'Doofus' 
    }, {
        $set: {
            name:'Rocksteady'
        }
    }, {
        returnOriginal:false
    }).then((res) =>{
        console.log(res);
    });
    db.collection('Users')
        .findOneAndUpdate(
        { name: 'Donkey'},
        {$inc:{ age: 1} },
        {returnOriginal:false} )
        .then((res)=>{console.log(res)});
  
    //client.close();
}); 
    