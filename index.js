/**
 * Contentful Dupplicate tool.
 * Allows you to duplicate entries in/between Contentful spaces recursively
 */

const minimist = require('minimist');
const version = require('./cmds/version');
const help = require('./cmds/help');
const duplicate = require('./cmds/duplicate');

module.exports = () => {
  // grab command line options
  const args = minimist(process.argv.slice(2), {
    boolean: ['publish'],
    default: {
      publish: true,
      exclude: '',
      'single-level': false,
      'target-space-id': '',
      suffix: '',
      prefix: '',
    },
  });

  let cmd = args._[0] || 'duplicate';

  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  }

  switch (cmd) {
    case 'version':
      // show version
      version(args);
      break;

    case 'help':
      // show help
      help(args);
      break;

    default:
      // do the duplicate
      duplicate(args);
      break;
  }
};
