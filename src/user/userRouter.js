const express = require('express');
const req = require('express/lib/request');
const userService = require('./userService');
var router = express.Router();
const { check, validationResult } = require('express-validator');

// const validateUser = function (req, res, next) {
//   const user = req.body;
//   if (user.username === null) {
//     req.validationErrors = {
//       username: 'Username cannot be null',
//     };
//   }
//   next();
// };

// const validateEmail = function (req, res, next) {
//   const user = req.body;
//   console.log('req object', req.validationErrors);
//   if (user.email === null) {
//     req.validationErrors = {
//       ...req.validationErrors,
//       email: 'Email cannot be null',
//     };
//   }
//   next();
// };

const validation = [
  check('username').notEmpty().withMessage('Username cannot be null'),
  check('email').notEmpty().withMessage('Email cannot be null'),
  check('password').notEmpty().withMessage('Password cannot be null'),
];

function handleValidationErrors(req, res, next) {
  const errorResponse = validationResult(req);
  const errors = errorResponse.errors;
  if (!errorResponse.isEmpty()) {
    const validationErrors = {};
    errors.map((err) => (validationErrors[err.param] = err.msg));
    return res.status(400).send({ validationErrors: validationErrors });
  }

  next();
}

module.exports = router.post('/api/1.0/users', validation, handleValidationErrors, async (req, res) => {
  const response = await userService.saveUser(req.body);
  return res.send({ message: 'User Created', response: response });
});
