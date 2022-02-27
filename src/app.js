const express = require('express');
const User = require('./user/user');
const app = express();
const userRouter = require('./user/userRouter');

app.use(express.json());

app.use(userRouter);

console.log('env: ' + process.env.NODE_ENV);

module.exports = app;
