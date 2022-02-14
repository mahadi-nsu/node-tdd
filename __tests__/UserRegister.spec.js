const request = require('supertest');
const app = require('../app');

it('should return 200 when signup request is valid', (done) => {
  request(app)
    .post('/api/1.0/users')
    .send({
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'p4ssword',
    })
    .then((response) => {
      expect(response.status).toBe(200);
      done();
    });
});

it('should return Success Message when signup request is valid', (done) => {
  request(app)
    .post('/api/1.0/users')
    .send({
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'p4ssword',
    })
    .then((response) => {
      expect(response.body.message).toBe('User Created');
      done();
    });
});
