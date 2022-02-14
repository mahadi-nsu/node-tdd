const request = require('supertest');
const app = require('../app');

it('should return 200 when signup request is valid', () => {
  request(app)
    .post('/api/1.0/users')
    .send({
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'p4ssword',
    })
    .expect(200);
});
