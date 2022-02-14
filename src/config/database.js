const Sequelize = require('sequelize');

const sequelize = new Sequelize('hoaxify', 'my-db-user', 'db-pass', {
  dialect: 'sqlite',
  storages: './database.sqlite',
});

module.exports = sequelize;
