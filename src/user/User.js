// initiate sequalize
const Sequelize = require('sequelize');
// import our database connection
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class User extends Model {}

User.init(
  {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: 'user',
  }
);

module.exports = User;
