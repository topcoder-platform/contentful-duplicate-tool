const contentful = require('contentful-management');
const ora = require('ora');
const error = require('../utils/error');
const duplicateEntry = require('../utils/duplicateEntry');
const constants = require('../shared/constants');

const spinner = ora();

// list of all content types needed when duplicating
const createdEntryContentTypes = [];

const iterateCreateEntryContentTypes = async (entryId, env, excludeEntryIds) => {
  const entry = await env.getEntry(entryId)
    .catch((err) => {
      spinner.stop();
      error(err.message);
    });
  if (!createdEntryContentTypes.includes(entry.sys.contentType.sys.id)) {
    createdEntryContentTypes.push(entry.sys.contentType.sys.id);
  }

  for (const field of Object.keys(entry.fields)) {
    // iterates through other fields, if the field contains a link to another entry,
    // then fetch the sub entry recursively
    const fieldContent = entry.fields[field];

    for (const fieldContentKey of Object.keys(fieldContent)) {
      const fieldContentValue = fieldContent[fieldContentKey];

      if (Array.isArray(fieldContentValue)) {
        /* eslint-disable no-await-in-loop */
        for (const content of fieldContentValue) {
          if (content.sys.type === constants.LINK_TYPE
            && content.sys.linkType === constants.ENTRY_TYPE
            && !excludeEntryIds.includes(content.sys.id)) {
            await iterateCreateEntryContentTypes(content.sys.id, env, excludeEntryIds);
          }
        }
        /* eslint-enable no-await-in-loop */
      }
    }
  }
};

const duplicateEntries = async (
  entries, sourceEnv, publish, exclude, singleLevel, targetEnv, prefix, suffix, regex, replaceStr,
) => {
  // check if the target environment has enough needed content types or not
  /* eslint-disable no-await-in-loop */
  for (const entryId of entries) {
    await iterateCreateEntryContentTypes(entryId, sourceEnv, exclude);
  }
  /* eslint-enable no-await-in-loop */

  const targetContentTypes = await targetEnv.getContentTypes();
  const unexistedContentTypes = [];
  createdEntryContentTypes.forEach((type) => {
    const idx = targetContentTypes.items.find(item => item.sys.id === type);

    if (typeof idx === 'undefined') {
      unexistedContentTypes.push(type);
    }
  });

  // if the target environment have enough needed content types, then duplicate entries
  if (unexistedContentTypes.length === 0) {
    spinner.info(`Start duplcate entries : [${entries}]`);

    entries.forEach((entryId) => {
      duplicateEntry(entryId, sourceEnv, publish, exclude, singleLevel, targetEnv,
        prefix, suffix, regex, replaceStr, targetContentTypes).then((entry) => {
        const entryNameObj = entry.fields.name;
        const firstKeyName = Object.keys(entry.fields.name)[0];

        spinner.info(`Duplicate entry ${entryId} successfully. New entry #${entry.sys.id} - ${entryNameObj[firstKeyName]}`);
      });
    });
  } else {
    spinner.stop();
    error(`Target Environment do not have these content types [${unexistedContentTypes.join(', ')}]`);
  }
};

module.exports = async (args) => {
  const spaceId = args['space-id'];
  const accessToken = args.mToken;
  const entries = args.entries.split(',');
  const exclude = args.exclude.split(',');
  const environment = args.environment || 'master';
  const targetEnvironment = args['target-environment'] || environment;

  spinner.start();

  // grab source and target environment
  const client = contentful.createClient({
    accessToken,
  });
  const sourceEnv = await client.getSpace(spaceId)
    .then(space => space.getEnvironment(environment))
    .catch((err) => {
      spinner.stop();
      error(err.message, true);
    });

  let targetEnv = sourceEnv;
  if (args['target-space-id']) {
    const targetClient = contentful.createClient({
      accessToken: args['mToken-target'] ? args['mToken-target'] : accessToken,
    });

    targetEnv = await targetClient.getSpace(args['target-space-id'])
      .then(space => space.getEnvironment(targetEnvironment))
      .catch((err) => {
        spinner.stop();
        error(err.message, true);
      });
  }

  // build regex object
  let regex = null;
  if (args['regex-pattern'] && args['replace-str']) {
    regex = new RegExp(args['regex-pattern']);
  }

  await duplicateEntries(
    entries, sourceEnv, args.publish, exclude, args['single-level'], targetEnv, args.prefix, args.suffix, regex, args['replace-str'],
  );

  spinner.stop();
};
