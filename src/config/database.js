const Sequelize = require('sequelize');
const logger = require('../logger/');

const sequelize = new Sequelize('hoaxify', 'my-db-user', 'db-pass', {
  dialect: 'sqlite',
  storage: './data/data.sqlite3',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection established.');
  })
  .catch((error) => {
    logger.error('Unable to connect to db: ', error);
  });

module.exports = sequelize;
