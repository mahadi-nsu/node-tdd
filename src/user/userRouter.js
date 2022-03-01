const express = require('express');
const userService = require('./userService');
var router = express.Router();

module.exports = router.post('/api/1.0/users', async (req, res) => {
  const user = req.body;
  if (user.username === null) {
    return res.status(400).send({ error: 'Username is required' });
  }
  const response = await userService.saveUser(req.body);
  return res.send({ message: 'User Created', response: response });
});
