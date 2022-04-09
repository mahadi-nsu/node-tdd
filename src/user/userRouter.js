const express = require('express');
const req = require('express/lib/request');
const userService = require('./userService');
var router = express.Router();
const User = require('./user');
const { check, validationResult } = require('express-validator');

const validation = [
  check('username')
    .notEmpty()
    .withMessage('Username cannot be null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have minimum length 4 characters and maximum 32 characters'),
  check('email')
    .notEmpty()
    .withMessage('Email cannot be null')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        throw new Error('E-mail in use');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password cannot be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password should be atleast 6 characters long')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Password should atleast 1 lowercase 1 uppercase 1 number'),
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
