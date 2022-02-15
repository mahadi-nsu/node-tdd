const buildDevLogger = require('./dev-logger');

let logger = buildDevLogger();
// if (process.env.NODE_ENV === 'development') {
//   logger = buildDevLogger();
// } else {
//   logger = buildProdLogger();
// }
module.exports = logger;