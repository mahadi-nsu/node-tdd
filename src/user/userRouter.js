const express = require('express');
const req = require('express/lib/request');
const userService = require('./userService');
var router = express.Router();
const { check, validationResult } = require('express-validator');

const validation = [
  check('username')
    .notEmpty()
    .withMessage('username_null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('username_size'),
  check('email')
    .notEmpty()
    .withMessage('email_null')
    .bail()
    .isEmail()
    .withMessage('email_invalid')
    .bail()
    .custom(async (email) => {
      const user = await userService.findbyEmail(email);
      if (user) {
        throw new Error('email_inuse');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('password_null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('password_size')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('password_pattern'),
];

function handleValidationErrors(req, res, next) {
  const errorResponse = validationResult(req);
  const errors = errorResponse.errors;

  // console.log(JSON.parse(req.t(errors[0])));
  if (!errorResponse.isEmpty()) {
    const validationErrors = {};
    errors.map((err) => (validationErrors[err.param] = req.t(err.msg))); //t for translate
    return res.status(400).send({ validationErrors: validationErrors });
  }

  next();
}

module.exports = router.post('/api/1.0/users', validation, handleValidationErrors, async (req, res) => {
  const response = await userService.saveUser(req.body);
  return res.send({ message: req.t('user_created'), response: response });
});
