const bcrypt = require('bcrypt');
const User = require('./user');

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

  const newUser = { username, email, password: hash };
  return await User.create(newUser);
};

const findbyEmail = async (email) => {
  return User.findOne({ where: { email: email } });
};

module.exports = { saveUser, findbyEmail };
