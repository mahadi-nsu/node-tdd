// const nodemailerStub = require('nodemailer-stub');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: '8587',
  tls: {
    rejectUnauthorized: true,
  },
});

module.exports = transporter;
