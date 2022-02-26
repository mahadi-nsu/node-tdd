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
  it('should return 200 when signup request is valid', async () => {
    const response = await postValidUsers();
    expect(response.status).toBe(200);
  });

  it('should return Success Message when signup request is valid', async () => {
    const response = await postValidUsers();
    expect(response.body.message).toBe('User Created');
  });

  it('should save the user to the database', async () => {
    await postValidUsers();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it('should save username and email', async () => {
    await postValidUsers();
    const userList = await User.findAll();
    expect(userList[0].username).toBe('user1');
    expect(userList[0].email).toBe('user1@gmail.com');
  });

  it('should hash password', async () => {
    await postValidUsers();
    const userList = await User.findAll();
    expect(userList[0].password).not.toBe('p4ssword');
  });
});
