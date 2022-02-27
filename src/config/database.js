const Sequelize = require('sequelize');
const logger = require('../logger/');
const config = require('config');
const dbconfig = config.get('database');

const sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, {
  dialect: dbconfig.dialect,
  storage: dbconfig.storage,
  logging: dbconfig.logging,
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
