const app = require('./src/app');
const sequelize = require('./src/config/database');

sequelize.sync();

// console.log('env' + process.env.NODE_ENV);

app.listen(3000, () => {
  console.log('app listening on port 3000');
});
