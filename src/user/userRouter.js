const express = require('express');
const userService = require('./userService');
var router = express.Router();

const validateUser = function(req, res, next) {
  const user = req.body;
  if (user.username === null) {
    return res.status(400).send({ validationError: {
      username: "Username cannot be null"
    }});
  }
  next();
}


const validateEmail = function(req, res, next) {
  const user = req.body;
  if (user.email === null) {
    return res.status(400).send({ validationError: {
      email: "Email cannot be null"
    }});
  }
  next();
}


module.exports = router.post('/api/1.0/users',validateUser, validateEmail,async (req, res) => {

  const response = await userService.saveUser(req.body);
  return res.send({ message: 'User Created', response: response });
});
