const nodemailerStub = require('nodemailer-stub');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(nodemailerStub.stubTransport);

module.exports = transporter;
