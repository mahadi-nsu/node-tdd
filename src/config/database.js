const Sequelize = require('sequelize');

const sequelize = new Sequelize('hoaxify', 'my-db-user', 'db-pass', {
  dialect: 'sqlite',
  storage: './data/data.sqlite3',
});

module.exports = sequelize;
