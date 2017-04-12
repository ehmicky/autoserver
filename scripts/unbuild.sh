#/bin/bash
# See build.sh for more explanation

rootDir="$( dirname $0 )/.."
graphqlAnywhereDir="$rootDir/node_modules/graphql-anywhere"
rm -rf "$graphqlAnywhereDir"
