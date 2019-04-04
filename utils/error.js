const ora = require('ora');

module.exports = (message, exit) => {
  ora().fail(message);
  if (exit) {
    process.exit(1);
  }
};
