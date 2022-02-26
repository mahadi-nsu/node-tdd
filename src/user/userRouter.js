const express = require('express');
const userService = require('./userService');
var router = express.Router();

module.exports = router.post('/api/1.0/users', async (req, res) => {
  const response = await userService.saveUser(req.body);
  return res.send({ message: 'User Created', response: response });
});
