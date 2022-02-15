const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

beforeAll(() => {
  sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe('User Registration', () => {
  it('should return 200 when signup request is valid', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'p4ssword',
      })
      .then((response) => {
        // console.log(response);
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

  it('should save the user to the database', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'p4ssword',
      })
      .then(() => {
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
        });
        done();
      });
  });

  it('should save username and email', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'p4ssword',
      })
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe('user1');
          expect(savedUser.email).toBe('user1@gmail.com');
        });
        done();
      });
  });
});
