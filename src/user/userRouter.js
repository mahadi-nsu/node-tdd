const express = require('express');

const bcrypt = require('bcrypt');
const User = require('./User');

var router = express.Router();

module.exports = router.post('/api/1.0/users', (req, res) => {
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
