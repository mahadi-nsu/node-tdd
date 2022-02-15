const express = require('express');
// const User = require('./user/User');
const app = express();
const logger = require('./logger');
// var bodyParser = require('body-parser');
const sequelize = require('./config/database');

// app.use(bodyParser.json());
app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection established.');
  })
  .catch((error) => {
    logger.error('Unable to connect to db: ', error);
  });

app.get('/', (req, res) => {
  logger.warn('Mahadi');
  res.send('Hello World');
});

app.post('/api/1.0/users', (req, res) => {
  // return res.status(200).send({
  //   message: 'User Created',
  // });

  logger.warn(JSON.stringify(req.body));
  res.send('Hello World! - Winston logged');
  // console.log(res);

  // User.create(req.body).then((response) => {
  //   console.log(response);
  //   return res.send({ message: 'User Created' });
  // });
});

module.exports = app;
