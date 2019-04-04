# Contentful Duplicate Tool
The contentful-duplicate cli allows users to duplicate entries in Contenful from the source space environment to the target space environment. The tool is written in NodeJS.

# Deployment and Execution
1.  Prerequisites:
    - NodeJS 10.15.3 (other recent versions should also work fine);
    - Contentful account (https://www.contentful.com/)
    - Create an access token to access Contentful Management API https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/authentication
     
2. Execution

    `npm install`

    `./bin/contentful-duplicate [--options]` (check `./bin/contentful-duplicate --help` for more details)

    **Run `npm link` in the root of your project will symlink your binary file to the system path, making it accessible from anywhere by running `contentful-duplicate` [Optional]**

3. Run linters 
    `npm run lint`

# Usage
The following info can also be found using the help menu of the command (`contenful-duplicate --help`)

<pre>
contentful-duplicate  [--version] [--help]
                      &lt;--space-id &lt;spaceId&gt;&gt; &lt;--mToken &lt;mToken&gt;&gt; &lt;--entries &lt;entryIds,...&gt;&gt;
                      [--environment &lt;environmentName&gt;]
                      [--target-space-id &lt;targetSpaceId&gt;] [--mToken-target &lt;mTokenTarget&gt;]
                      [--target-environment &lt;targetEnvironmentId&gt;]
                      [--exclude &lt;excludeEntryIds,...&gt;]
                      [--prefix &lt;prefixString&gt;] [--suffix &lt;suffixString&gt;]
                      [&lt;--regex-pattern&gt; &lt;regexPattern&gt; &lt;--replace-str&gt; &lt;replaceString&gt;]
                      [--publish &lt;false&gt;]
                      [--single-level &lt;true|false&gt;]
</pre>

**NOTE**: The following flags are required:
+ --space-id
+ --mToken
+ --entries

**Refer to [Contentful duplicate - Help](docs/contentful-duplicate.md) Guide for some examples**

## Flag Options
|Flag                     |Description|
|---                      |---|
| --version                |Display version information and exit.|
| --help                   |Display this help and exit.|
| --space-id               |Required*. Space ID of the source space.|
| --mToken                 |Required*. Token to access the source space.|
| --entries                |Required*. Comma separated list of entry IDs that the user would like to duplicate.|
| --environment            |Source environment name in the source space to duplicate. If not provided, default to 'master'.|
| --target-space-id        |ID of the target space. If not provided, the target space will be the same as the source space.|
| --mToken-target          |Token to access the target space. If not provided, use the same value as mToken.|
| --target-environment     |Target environment name in the target space to duplicate to. If not provided, use the same name as source environment name.|
| --exclude                |Comma separated list of entry IDs to exclude when duplicating.|
| --prefix                 |String to prefix to the titles of all the entries when duplicating to target.|
| --suffix                 |String to suffix to titles of all entries when duplicating to target.|
| --regex-pattern          |Regex pattern to search in titles of entries when duplicating to target. This flag input is required if --replace-str is provided.|
| --replace-str            |String to replace the regex pattern with in titles of entries when duplicating to target. This flag input is required if --regex-pattern is provided.|
| --publish                |The only valid option is false. If set to false, the states of the duplicated entries in target will be draft. If not provided, the states of the duplicated entries in target will be the same as source.|
| --single-level        |Default value is false. If set to true, only the first level entries will be duplicated to target. Child entries won't be duplicated.|

## Test cases
The file `samples/contentful-data.json` can be used to create some dummy data for testing purpose (import content types and content).

1. Duplicate published entries recursively in a same space
Duplicate HOME PAGE to CONTACT PAGE, add prefix [COPY] and suffix [cloned]
https://monosnap.com/file/zSBXsGYPmxY4jHb2BlBnNEDiME7fmp

2. Duplicate published entries recursively in a same space, but do not publish new entries
https://monosnap.com/file/cw59f4Ix5pnVx4l3r3Fq0UoRSUzsfg

3. Duplicate published entries recursively in a different space
Duplicated entry banner is draft because it doesn't have the asset (which is a required field for background image)
https://monosnap.com/file/jeO2HW6AtWqDc2varjBgpf92n1jiTJ

4. Duplicate published entries recursively in a different space missing content type
https://monosnap.com/file/ihQ5EYO9SjQJo4WXI7SFK0vDekvQcG

5. Duplicate single level
https://monosnap.com/file/pi0zH97fmNpEOlRoHm16KJuRCzWvX6

6. Duplicate exclude entry
https://monosnap.com/file/MNBS3UckD10PDno8j1l7sVP0LuSFCT
