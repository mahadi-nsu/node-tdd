const express = require('express');
const User = require('./user/user');
const app = express();
const userRouter = require('./user/userRouter');

app.use(express.json());

app.use(userRouter);

module.exports = app;
