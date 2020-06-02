const request = require('supertest');
const app = require('../api/server'); // the express server

let token;

beforeAll((done) => {
  request(app)
    .post('/api/auth/login')
    .send({
      username: "JaneDoe",
      password: "asdf123",
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});


describe("Post Endpoints", () => {
    it('should create a new user', async() => {
        return request(app)
        .post('/api/auth/register')
        // .set('Authorization', `Bearer ${token}`)
        .send({
            username: "joejohndave",
            password: "password123",
            email: "email@email.com",
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.type).toBe('application/json');
        });
    })


    it('should login a new user', async() => {
        return request(app)
        .post('/api/auth/login')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: "JaneDoe",
            password: "asdf123",
        })
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.type).toBe('application/json');
        });
    })
})
