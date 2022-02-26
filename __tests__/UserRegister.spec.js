const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/user');
const sequelize = require('../src/config/database');
const logger = require('../src/logger');

beforeAll(() => {
  sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

const postValidUsers = () => {
  return request(app).post('/api/1.0/users').send({
    username: 'user1',
    email: 'user1@gmail.com',
    password: 'p4ssword',
  });
};

describe('User Registration', () => {
  it('should return 200 when signup request is valid', (done) => {
    postValidUsers().then((response) => {
      // console.log(response);
      expect(response.status).toBe(200);
      done();
    });
  });

  it('should return Success Message when signup request is valid', (done) => {
    postValidUsers().then((response) => {
      expect(response.body.message).toBe('User Created');
      done();
    });
  });

  it('should save the user to the database', (done) => {
    postValidUsers().then((response) => {
      logger.warn(response);

      User.findAll().then((userList) => {
        expect(userList.length).toBe(1);
        done();
      });
    });
  });

  it('should save username and email', (done) => {
    postValidUsers().then(() => {
      User.findAll().then((userList) => {
        // const savedUser = userList[0];
        expect(userList[0].username).toBe('user1');
        expect(userList[0].email).toBe('user1@gmail.com');
        done();
      });
    });
  });

  it('should hash password', (done) => {
    postValidUsers().then(() => {
      User.findAll().then((userList) => {
        console.log('passowrd we get', userList[0].password);
        expect(userList[0].password).not.toBe('p4ssword');
        done();
      });
    });
  });
});
