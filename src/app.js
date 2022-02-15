const express = require('express');
const User = require('./user/User');
const app = express();
const logger = require('./logger');

app.use(express.json());

app.post('/api/1.0/users', (req, res) => {
  User.create(req.body).then((response) => {
    logger.info(response);
    return res.send({ message: 'User Created' });
  });
});

module.exports = app;
