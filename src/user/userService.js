const bcrypt = require('bcrypt');
const User = require('./user');
const crypto = require('crypto');
const EmailService = require('../email/EmailService');
const sequelize = require('../config/database');
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
  const transaction = await sequelize.transaction();
  const userCreateresponse = await User.create(newUser, { transaction });
  try {
    await EmailService.sendAccountActivation(email, newUser.activationToken);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
  return userCreateresponse;
};

const findbyEmail = async (email) => {
  return User.findOne({ where: { email: email } });
};

module.exports = { saveUser, findbyEmail };
