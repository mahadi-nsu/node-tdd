const bcrypt = require('bcrypt');
const User = require('./User');

const saveUser = async (user) => {
  const hash = await bcrypt.hash(user.password, 10);
  // approach - 1

  // const user = {
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: hash,
  // };

  // approach - 2
  const newUser = { ...user, password: hash };
  return await User.create(newUser);
};

module.exports = { saveUser };
