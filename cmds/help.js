const ora = require('ora');

const menus = {
  main: `
  This is the help information of contentful-duplicate tool.

  usage: contentful-duplicate [--version] [--help]
                              <--space-id <spaceId>> <--mToken <mToken>> <--entries <entryIds,...>>
                              [--environment <environmentName>]
                              [--target-space-id <targetSpaceId>] [--mToken-target <mTokenTarget>]
                              [--target-environment <targetEnvironmentId>]
                              [--exclude <excludeEntryIds,...>]
                              [--prefix <prefixString>] [--suffix <suffixString>]
                              [<--regex-pattern> <regexPattern> <--replace-str> <replaceString>]
                              [--publish <false>]
                              [--single-level <true|false>]

  NOTE: The following flags are required:
          --space-id
          --mToken
          --entries

  --version                 Display version information and exit.
  --help                    Display this help and exit.
  --space-id                Required*. Space ID of the source space.
  --mToken                  Required*. Token to access the source space.
  --entries                 Required*. Comma separated list of entry IDs that the user would like to
                            duplicate.
  --environment             Source environment name in the source space to duplicate. If not provided,
                            default to 'master'.
  --target-space-id         ID of the target space. If not provided, the target space will be
                            the same as the source space.
  --mToken-target           Token to access the target space. If not provided, use the same
                            value as mToken.
  --target-environment      Target environment name in the target space to duplicate to. If not
                            provided, use the same name as source environment name.
  --exclude                 Comma separated list of entry IDs to exclude when duplicating.
  --prefix                  String to prefix to the titles of all the entries when duplicating to
                            target.
  --suffix                  String to suffix to titles of all entries when duplicating to
                            target.
  --regex-pattern           Regex pattern to search in titles of entries when duplicating to target.
                            This flag input is required if --replace-str is provided.
  --replace-str             String to replace the regex pattern with in titles of entries when
                            duplicating to target. This flag input is required if --regex-pattern is
                            provided.
  --publish                 The only valid option is false. If set to false, the states of the duplicated
                            entries in target will be draft. If not provided, the states of the
                            duplicated entries in target will be the same as source.
  --single-level         Default value is false. If set to true, only the first level entries will
                            be duplicated to target. Child entries won't be duplicated.
  `,
};

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0];

  ora().info(menus[subCmd] || menus.main);
};
