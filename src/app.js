const express = require('express');
// const User = require('./user/User');
const app = express();
const sequelize = require('./config/database');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection established.');
  })
  .catch((error) => {
    console.log('Unable to connect to db: ', error);
  });

app.get('/', (req, res) => {
  console.log('Mahadi');
  res.send('Hello World');
});

app.post('/api/1.0/users', (req, res) => {
  // return res.status(200).send({
  //   message: 'User Created',
  // });

  console.log(req.body);
  console.log(res);

  // User.create(req.body).then((response) => {
  //   console.log(response);
  //   return res.send({ message: 'User Created' });
  // });
});

module.exports = app;
