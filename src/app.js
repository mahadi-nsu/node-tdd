const express = require('express');
const User = require('./user/User');
const app = express();
const logger = require('./logger');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/api/1.0/users', (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    // approach - 1

    // const user = {
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: hash,
    // };

    // approach - 2
    const user = { ...req.body, password: hash };

    User.create(user).then((response) => {
      return res.send({ message: 'User Created', response: response });
    });
  });
});

module.exports = app;
