const bcrypt = require('bcrypt');
const User = require('./user');
const crypto = require('crypto');
const nodemailerStub = require('nodemailer-stub');
const nodemailer = require('nodemailer');

const generateToken = (length) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
};

const saveUser = async (user) => {
  const { username, email, password } = user;
  const hash = await bcrypt.hash(password, 10);
  // approach - 1

  // const user = {
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: hash,
  // };

  // approach - 2

  const newUser = { username, email, password: hash, activationToken: generateToken(16) };
  const userCreateresponse = await User.create(newUser);

  const transporter = nodemailer.createTransport(nodemailerStub.stubTransport);
  await transporter.sendMail({
    from: 'My App <info@my-app.com>',
    to: email,
    subject: 'Account Activation',
    html: `Token is ${newUser.activationToken}`,
  });

  return userCreateresponse;
};

const findbyEmail = async (email) => {
  return User.findOne({ where: { email: email } });
};

module.exports = { saveUser, findbyEmail };
