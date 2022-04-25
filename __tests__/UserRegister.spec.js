const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/user');
const sequelize = require('../src/config/database');
const logger = require('../src/logger');
const nodemailerStub = require('nodemailer-stub');

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

const postUser = (user = validUser, options = {}) => {
  const agent = request(app).post('/api/1.0/users');
  if (options.language) {
    agent.set('Accept-Language', options.language);
  }
  return agent.send(user);
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

  it('create user in inactive mode', async () => {
    const response = await postUser();
    // console.log('response', response.body);
    expect(response.body.response.inactive).toBe(true);
  });

  it('Even if inactive is sent false still we need to set user in inactive mode', async () => {
    const newUser = { ...validUser, inactive: false };
    const response = await postUser(newUser);
    expect(response.body.response.inactive).toBe(true);
  });

  it('Creates an activation token for user', async () => {
    const response = await postUser();
    expect(response.body.response.activationToken).toBeTruthy();
  });

  it('sends an account activation email with activationcode', async () => {
    const response = await postUser();
    const lastmail = nodemailerStub.interactsWithMail.lastMail();
    console.log('Mahadi');
    console.log(lastmail);
    expect(lastmail.to[0]).toBe('user1@gmail.com');
    expect(lastmail.content).toContain(response.body.response.activationToken);
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

  const username_null = 'Username cannot be null';
  const username_size = 'Must have minimum length 4 characters and maximum 32 characters';
  const email_null = 'Email cannot be null';
  const email_invalid = 'Email is not valid';
  const password_null = 'Password cannot be null';
  const password_size = 'Password should be atleast 6 characters long';
  const password_pattern = 'Password should atleast 1 lowercase 1 uppercase 1 number';
  const email_inuse = 'E-mail in use';
  // const user_created = 'User created';

  it.each`
    field         | value                   | expectedMessage
    ${'username'} | ${null}                 | ${username_null}
    ${'username'} | ${'usr'}                | ${username_size}
    ${'username'} | ${'a'.repeat(33)}       | ${username_size}
    ${'email'}    | ${null}                 | ${email_null}
    ${'email'}    | ${'mail.com'}           | ${email_invalid}
    ${'email'}    | ${'user.mail.com'}      | ${email_invalid}
    ${'email'}    | ${'user@mail'}          | ${email_invalid}
    ${'password'} | ${null}                 | ${password_null}
    ${'password'} | ${'pss'}                | ${password_size}
    ${'password'} | ${'alllowercase'}       | ${password_pattern}
    ${'password'} | ${'ALLUPPERCASE'}       | ${password_pattern}
    ${'password'} | ${'123456789'}          | ${password_pattern}
    ${'password'} | ${'ALLowercase'}        | ${password_pattern}
    ${'password'} | ${'alllowercaseand666'} | ${password_pattern}
    ${'password'} | ${'ALL6666666'}         | ${password_pattern}
  `('returns $expectedMessage when $field is $value', async ({ field, value, expectedMessage }) => {
    const user = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'p4ssword',
    };

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

  it('Should return email in use when email is already in use', async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    expect(response.body.validationErrors.email).toBe(email_inuse);
  });

  it('Should return error for both email and username', async () => {
    await User.create({ ...validUser });
    const response = await postUser({
      username: null,
      email: validUser.email,
      password: validUser.password,
    });
    expect(Object.keys(response.body.validationErrors)).toEqual(['username', 'email']);
  });
});

describe('Internationalization', () => {
  // const postUser = (user = validUser) => {
  //   return request(app).post('/api/1.0/users').set('Accept-Language', 'bn').send(user);
  // };

  const username_null = 'ইউজারনেম খালি হতে পারবে না';
  const username_size = 'সর্বনিম্ন দৈর্ঘ্য 4 অক্ষর এবং সর্বোচ্চ 32 অক্ষর থাকতে হবে';
  const email_null = 'ইমেইল খালি হতে পারবে না';
  const email_invalid = 'ইমেল বৈধ নয়';
  const password_null = 'পাসওয়ার্ড খালি হতে পারে না';
  const password_size = 'পাসওয়ার্ড কমপক্ষে 6 অক্ষর দীর্ঘ হওয়া উচিত';
  const password_pattern = 'পাসওয়ার্ড কমপক্ষে 1 ছোট হাতের 1 বড় হাতের 1 সংখ্যা হওয়া উচিত';
  const email_inuse = 'ই-মেইল অলরেডি ব্যবহার হচ্ছে';
  const user_created = 'ইউজার তৈরি সম্পন্ন';

  it.each`
    field         | value                   | expectedMessage
    ${'username'} | ${null}                 | ${username_null}
    ${'username'} | ${'usr'}                | ${username_size}
    ${'username'} | ${'a'.repeat(33)}       | ${username_size}
    ${'email'}    | ${null}                 | ${email_null}
    ${'email'}    | ${'mail.com'}           | ${email_invalid}
    ${'email'}    | ${'user.mail.com'}      | ${email_invalid}
    ${'email'}    | ${'user@mail'}          | ${email_invalid}
    ${'password'} | ${null}                 | ${password_null}
    ${'password'} | ${'pss'}                | ${password_size}
    ${'password'} | ${'alllowercase'}       | ${password_pattern}
    ${'password'} | ${'ALLUPPERCASE'}       | ${password_pattern}
    ${'password'} | ${'123456789'}          | ${password_pattern}
    ${'password'} | ${'ALLowercase'}        | ${password_pattern}
    ${'password'} | ${'alllowercaseand666'} | ${password_pattern}
    ${'password'} | ${'ALL6666666'}         | ${password_pattern}
  `('returns $expectedMessage when $field is $value', async ({ field, value, expectedMessage }) => {
    const user = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'p4ssword',
    };

    user[field] = value;
    const response = await postUser(user, { language: 'bn' });
    const body = response.body;
    expect(body.validationErrors[field]).toBe(expectedMessage);
  });

  it('Should return email in use when email is already in use', async () => {
    await User.create({ ...validUser });
    const response = await postUser({ ...validUser }, { language: 'bn' });
    expect(response.body.validationErrors.email).toBe(email_inuse);
  });

  it('should return Success Message when signup request is valid', async () => {
    const response = await postUser({ ...validUser }, { language: 'bn' });
    expect(response.body.message).toBe(user_created);
  });
});
