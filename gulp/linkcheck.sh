#!/bin/bash
# Checks for dead links in Markdown files

linkcheck() {
  for file in *.md docs/*/*.md docs/*/*/*.md
  do
    markdown-link-check "$file" 2> /dev/null \
      | grep "[✖]" \
      | sed "s|.\{3\}|'$file' contains broken link:|"
  done
}

broken_links="$( linkcheck )"

if [[ "$broken_links" != "" ]]; then
  echo "Dead links were found"$'\n'"$broken_links"
  exit 1
fi
