// const nodemailerStub = require('nodemailer-stub');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "virginawalker45@gmail.com", // ethereal user
    pass: "wal$#@!~365", // ethereal password
  },
});

module.exports = transporter;
