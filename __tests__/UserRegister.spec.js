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

const validUser = {
  username: 'user1',
  email: 'user1@gmail.com',
  password: 'P4ssword',
};

const postUser = (user = validUser) => {
  return request(app).post('/api/1.0/users').send(user);
};

describe('User Registration', () => {
  it('should return 200 when signup request is valid', async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it('should return Success Message when signup request is valid', async () => {
    const response = await postUser();
    expect(response.body.message).toBe('User Created');
  });

  it('should save the user to the database', async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it('should save username and email', async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList[0].username).toBe('user1');
    expect(userList[0].email).toBe('user1@gmail.com');
  });

  it('should hash password', async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList[0].password).not.toBe('p4ssword');
  });

  // validation test cases

  it('Should return 400 bad request when username is null', async () => {
    const response = await postUser({
      username: null,
      email: 'user1@gmail.com',
      password: 'p4ssword',
    });
    expect(response.status).toBe(400);
  });

  it('Should return both empty when email and username all are null', async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: 'P4ssword',
    });

    const body = response.body;
    console.log('testinggggggggg');
    console.log(body);
    console.log('error', body.validationErrors);
    console.log(Object.keys(body.validationErrors));
    expect(Object.keys(body.validationErrors)).toEqual(['username', 'email']);
  });
  // it('Should return empty when username is null', async () => {
  //   const response = await postUser({
  //     username: null,
  //     email: 'user1@gmail.com',
  //     password: 'p4ssword',
  //   });
  //   expect(response.body.validationErrors.username).toBe('Username cannot be null');
  // });

  // it('Should return empty when email is null', async () => {
  //   const response = await postUser({
  //     username: 'user1',
  //     email: null,
  //     password: 'p4ssword',
  //   });
  //   expect(response.body.validationErrors.email).toBe('Email cannot be null');
  // });

  // it('Should return a message of password cant be null when password is null', async () => {
  //   const response = await postUser({
  //     username: 'user1',
  //     email: 'user1@gmail.com',
  //     password: null,
  //   });
  //   expect(response.body.validationErrors.password).toBe('Password cannot be null');
  // });

  // it.each([
  //   ['username', 'Username cannot be null'],
  //   ['email', 'Email cannot be null'],
  //   ['password', 'Password cannot be null'],
  // ])('when %s is null %s is received', async (field, expectedMessage) => {
  //   const user = {
  //     username: 'user1',
  //     email: 'user1@gmail.com',
  //     password: 'p4ssword',
  //   };

  //   user[field] = null;
  //   const response = await postUser(user);
  //   const body = response.body;
  //   expect(body.validationErrors[field]).toBe(expectedMessage);
  // });

  it.each`
    field         | value                   | expectedMessage
    ${'username'} | ${null}                 | ${'Username cannot be null'}
    ${'username'} | ${'usr'}                | ${'Must have minimum length 4 characters and maximum 32 characters'}
    ${'username'} | ${'a'.repeat(33)}       | ${'Must have minimum length 4 characters and maximum 32 characters'}
    ${'email'}    | ${null}                 | ${'Email cannot be null'}
    ${'email'}    | ${'mail.com'}           | ${'Email is not valid'}
    ${'email'}    | ${'user.mail.com'}      | ${'Email is not valid'}
    ${'email'}    | ${'user@mail'}          | ${'Email is not valid'}
    ${'password'} | ${null}                 | ${'Password cannot be null'}
    ${'password'} | ${'pss'}                | ${'Password should be atleast 6 characters long'}
    ${'password'} | ${'alllowercase'}       | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
    ${'password'} | ${'ALLUPPERCASE'}       | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
    ${'password'} | ${'123456789'}          | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
    ${'password'} | ${'ALLowercase'}        | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
    ${'password'} | ${'alllowercaseand666'} | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
    ${'password'} | ${'ALL6666666'}         | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
  `('returns $expectedMessage when $field is $value', async ({ field, value, expectedMessage }) => {
    const user = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'p4ssword',
    };

    console.log('test');
    console.log(value);
    user[field] = value;
    const response = await postUser(user);
    const body = response.body;
    expect(body.validationErrors[field]).toBe(expectedMessage);
  });

  // it('Should return size validation error when username is less than 4 characters', async () => {
  //   const response = await postUser({
  //     username: 'usr',
  //     email: 'user1@gmail.com',
  //     password: 'p4ssword',
  //   });

  //   const body = response.body;
  //   expect(body.validationErrors.username).toBe('Must have minimum length 4 characters and maximum 32 characters');
  // });
});

//  ${'password'} | ${'alllowercase'}  | ${'Password should atleast 1 lowercase 1 uppercase 1 number'}
