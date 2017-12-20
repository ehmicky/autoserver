#!/bin/bash
# This file calculates some week-by-week stats about the code base size

# Header
echo "commit,date,commits,javascript,markdown,json,deps,devdeps" > stats/stats.csv.temp

shopt -s globstar

while read
do
  # If already parsed, keep as is
  if [[ "$REPLY" =~ "," ]]
  then
    echo "$REPLY"
  else
    range="$REPLY..$commit"

    # Use a commit, then calculate several stats about the repository
    commit="$REPLY"
    git checkout "$commit" 2> /dev/null

    date="$(git show -s --format="%ci" | sed 's/ .*//')"

    # Number of commits
    commits="$(git log --oneline "$range" | wc -l)"

    # Number of lines of JavaScript code
    javascript="$(sloc --format=csv [^n]*/**/*.js *.js | tail -n1 | cut -d, -f3)"
    # Number of lines of Markdown
    markdown="$(cat [^n]*/**/*.md *.md 2> /dev/null | wc -l)"
    # Number of lines of JSON
    json="$(cat [^n]*/**/*.json [^p]*.json 2> /dev/null | wc -l)"
    # Number of lines of production dependencies
    deps="$(node -p "Object.keys(require('./package').dependencies).length")"
    # Number of lines of dev dependences
    devdeps="$(node -p "Object.keys(require('./package').devDependencies).length")"

    # Write back to the file
    echo "$commit,$date,$commits,$javascript,$markdown,$json,$deps,$devdeps"
  fi
# Parse each line except header
done < <(tail -n+2 stats/stats.csv) >> stats/stats.csv.temp

# Since input and output are same,
mv stats/stats.csv.temp stats/stats.csv

# Go back to last commit
git checkout master &> /dev/null

cat ./stats/stats.csv
