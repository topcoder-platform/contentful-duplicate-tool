const ora = require('ora');
const { version } = require('../package.json');

module.exports = () => {
  ora().info(`v${version}`);
};
