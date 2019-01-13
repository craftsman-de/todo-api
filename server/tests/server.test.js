const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {ObjectID} = require('mongodb');
const todos = [
    {_id:new ObjectID(), text:'first test todo'},
    {_id:new ObjectID(), text:'second test todo'}
];

beforeEach( (done) =>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then( () => done());
});

describe('POST /todos' , () =>{

    it('should return fail with empty text', (done) =>{
        let text = '';
        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end((err,res) =>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch(e => done(e));
        });
    });

    it('should create a new todo', (done) =>{
        let text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();

            }).catch((e) =>done(e));
       });
    });

 });

 describe('GET /todos', ()=>{
     it('should get all todos', (done)=>{
         request(app)
         .get('/todos')
         .expect(200)
         .expect((res)=>{
             expect(res.body.todos.length).toBe(2);
         })
         .end(done);
     });
 });

 describe('GET /todos/:id', () => {
     it('should return todo doc', (done)=>{
         let idString = '/todos/'+todos[0]._id.toHexString();
        request(app)
        .get(idString)
        .expect(200)
        .expect((res) =>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
     });
     it('should return 404 if todo not found', (done)=>{
         let id = new ObjectID().toHexString();
         request(app)
         .get('/todos/'+id)
         .expect(404)
         .end(done);
     });
     it('should return 404 if invalid ID', (done)=>{
        
        request(app)
        .get('/todos/234')
        .expect(404)
        .end(done);
    });
 });
 describe('DELETE /todos/:id', () => {
     it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete('/todos/' +hexId)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBeFalsy();
                done();
            }).catch((e)=>done(e));
        });
     });

      it('should return 404 if todo not found', (done) =>{
        let id = new ObjectID().toHexString();
        request(app)
        .delete('/todos/'+id)
        .expect(404)
        .end(done);
      });

     it('should return 404 if the object id is invalid', (done)=>{
        request(app)
        .get('/todos/234')
        .expect(404)
        .end(done);
     });
 });