const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos,users,populateUsers} = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos' , () =>{

    it('should return fail with empty text', (done) =>{
        let text = '';
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res)=>{
             expect(res.body.todos.length).toBe(1);
         })
         .end(done);
     });
 });

 describe('GET /todos/:id', () => {
     it('should return todo doc', (done)=>{
         let idString = '/todos/'+todos[0]._id.toHexString();
        request(app)
        .get(idString)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) =>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
     });
     it('should not return todo doc created by other user', (done)=>{
        let idString = '/todos/'+todos[1]._id.toHexString();
       request(app)
       .get(idString)
       .set('x-auth', users[0].tokens[0].token)
       .expect(404)
       .end(done);
    });
     it('should return 404 if todo not found', (done)=>{
         let id = new ObjectID().toHexString();
         request(app)
         .get('/todos/'+id)
         .set('x-auth', users[0].tokens[0].token)
         .expect(404)
         .end(done);
     });
     it('should return 404 if invalid ID', (done)=>{
        
        request(app)
        .get('/todos/234')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
 });
 describe('DELETE /todos/:id', () => {
     it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete('/todos/' +hexId)
        .set('x-auth', users[1].tokens[0].token)
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
     it('should not be able to remove a todo if not auth user', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete('/todos/' +hexId)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).not.toBeFalsy();
                done();
            }).catch((e)=>done(e));
        });
     });
      it('should return 404 if todo not found', (done) =>{
        let id = new ObjectID().toHexString();
        
        request(app)
        .delete('/todos/'+id)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(err => {
            if(err)done(err);
            else
                done();
        });
      });

     it('should return 404 if the object id is invalid', (done)=>{
        request(app)
        .get('/todos/234')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(err => {
            if(err)done(err);
            else
                done();
        });
     });
 });
 describe('PATCH /todos/:id', ()=> {
    it('should update the todo' , (done) => {
        let id = todos[0]._id.toHexString();
        let text = 'Some new todo text';
        request(app)
        .patch('/todos/'+id)
        .set('x-auth', users[0].tokens[0].token)
        .send({completed:true,text})
        .expect(200)
        .expect((res) =>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(err => {
            if(err)done(err);
            else
                done();
        });
    });
 
        it('should fail updating the todo if user is trying to patch other creators todo' , (done) => {
            let id = todos[1]._id.toHexString();
            let text = 'Some new todo text';
            request(app)
            .patch('/todos/'+id)
            .set('x-auth', users[0].tokens[0].token)
            .send({completed:true,text})
            .expect(404)
            .end(err => {
                if(err)done(err);
                else
                    done();
            });
        });

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
        .patch('/todos/'+id)
        .set('x-auth', users[0].tokens[0].token)
        .send({ completed:false })
        .expect(200)
        .expect(res =>{
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBe(null);
        })
        .end(err => {
            if(err)done(err);
            else
                done();
        });




    });
 });
 describe('GET /users/me' , () => {
     it('should return user if authenticated', (done) => {
         request(app)
         .get('/users/me')
         .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) =>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
        });

        it('should return 401 if not authenticated', (done) => {
           
            request(app)
            .get('/users/me')
            .set('x-auth', 0)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
        });

 });
 describe('POST /users', () => {
     it('should create a user', (done) => {
         var email = 'example@example.com';
         var password = '123abdsam';

         request(app)
         .post('/users')
         .send({email, password})
         .expect(200)
         .expect((res)=>{
            // console.log(res.headers['x-auth']);
             expect(res.headers['x-auth']).toBeTruthy();
             expect(res.body._id).toBeTruthy();
             expect(res.body.email).toBe(email);
         })
         .end( (err) =>{
             if(err) {
             return done(err);
             }
             User.findOne({email}).then((user)=> {
                 expect(user).toBeTruthy();
                 expect(user.password).not.toBe(password);
                 done();
             });
         });
     });

     it('should return validation errors if request invalid', (done) =>{
        let password = "asdf";
        let email = "Joops";

        request(app)
        .get('/users/')
        .send({email, password})
        .expect(404)
        .end(err => {
            if(err)
                done(err);
            else
                done();
        });

     });
     it('should return an error if email already taken', (done) =>{
         let useremail = users[0].email;
         let userpassword = users[0].password;
       
        
            request(app)
            .post('/users/')
            .send({email:useremail,password:userpassword})
            .expect(400)
            .end(err => {
                if(err)done(err);
                else
                    done();
            });

    });
 });
 describe('POST /users/login', () =>{
     it('should login a user and return authtoken', done => {
          let email = users[1].email;
          let password = users[1].password;

         request(app)
         .post('/users/login')
         .send({email,password})
         .expect(200)
         .expect((res)=>{
             expect(res.headers['x-auth']).toBeTruthy();
             expect(res.body._id).toBeTruthy();
             expect(res.body.email).toBe(email);
        })
        .end((err,res) =>{
            if(err){
                return done(err);
            }
            User.findOne({email}).then(user => {
                expect(user.tokens[1]).toMatchObject({
                    access:'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch(e=>done(e));
        });
     });
     it('should reject invalid login', done => {
        let email = users[1].email;
        let password = 'letmei';
        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(400)
        .expect(res =>{
            expect(res.headers['x-auth']).not.toBeTruthy();
        })
        .end((err,res) => {
            if(err)done(err)
            else {
                User.findOne({email}).then(user=>{
                  expect(users.tokens).not.toBeTruthy();  
                  done();
                }).catch(e=>done(e))
                
               
            }
        });
     });
 });
 describe('DELETE /users/me/token', () => {
     it('should remove auth token on logout', done => {
         request(app)
         .delete('/users/me/token')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .end(err=>{
             if(err)done(err);
             else {
                 User.findOne({email:users[0].email}).then(user =>{
                    expect(users.tokens).not.toBeTruthy();
                    done();
                  }).catch(e=>done(e));
                }
         });
         
     });
 });