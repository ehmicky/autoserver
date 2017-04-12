#/bin/bash
# This file is a temporary fix for the following problem:
#  - we need pull request #51 of `graphql-anywhere` to be merged. It adds async/promise support
#  - so we are using the fork until it is merged upstream
#  - however the code uses TypeScript, and TypeScript configuration file is not available by npm because it is
#    in .npmignore file
#  - so we clone the Git repository then build it ourselves
# Extra issues:
#  - one test seems to fail, so we remove it with `sed`
#  - all this monkey patching seems to disagree with `npm`, and further `npm install` complain.
#    So before any new `npm` command, the `unbuild.sh` script must be run
# Hopefully, the fork will be merged very soon, so we can remove this

rootDir="$( dirname $0 )/.."
graphqlAnywhereDir="$rootDir/node_modules/graphql-anywhere"

$rootDir/scripts/unbuild.sh

git clone https://github.com/brysgo/graphql-anywhere "$graphqlAnywhereDir"
cd "$graphqlAnywhereDir"
sed -i '/passes info including isLeaf and resultKey/,+32 d' ./test/anywhere.ts
npm install
cd -
