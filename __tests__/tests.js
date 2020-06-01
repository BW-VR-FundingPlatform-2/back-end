const request = require('supertest');
const app = require('../api/server'); // the express server

/*
  declare the token variable in a scope accessible
  by the entire test suite
*/
let token;

beforeAll((done) => {
  request(app)
    .post('/api/auth/login')
    .send({
      username: "user",
      password: "pw",
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe('GET /', () => {
  // token not being sent - should respond with a 401
  test('It should require authorization', () => {
    return request(app)
      .get('/api/auth/logout')
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test('It responds with JSON', () => {
    return request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');
      });
  });
});

// need to check tests
// need to check that front end has what they need: ie a description saved in database not just title of project