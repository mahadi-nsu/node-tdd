const express = require('express');
const req = require('express/lib/request');
const userService = require('./userService');
var router = express.Router();

const validateUser = function (req, res, next) {
  const user = req.body;
  if (user.username === null) {
    req.validationErrors = {
      username: 'Username cannot be null',
    };
  }
  next();
};

const validateEmail = function (req, res, next) {
  const user = req.body;
  if (user.email === null) {
    // req.validationErrors = {
    //   email: 'Email cannot be null',
    // };

    req.validationErrors = {
      ...req.validationErrors,
      email: 'Email cannot be null',
    };
  }
  next();
};

module.exports = router.post('/api/1.0/users', validateUser, validateEmail, async (req, res) => {
  if (req.validationErrors) {
    const response = { validationErrors: { ...req.validationErrors } };
    return res.status(400).send(response);
  }
  const response = await userService.saveUser(req.body);
  return res.send({ message: 'User Created', response: response });
});
