'use strict';

const yaml = require('js-yaml');

// Parses a YAML file
const parse = function ({ content, path }) {
  return yaml.load(content, {
    schema: yaml.JSON_SCHEMA,
    json: true,
    // Error handling
    filename: path,
    onWarning (error) {
      // eslint-disable-next-line fp/no-throw
      throw error;
    },
  });
};

// Serializes a YAML file
const serialize = function ({ content }) {
  return yaml.dump(content, {
    schema: yaml.JSON_SCHEMA,
    noRefs: true,
  });
};

module.exports = {
  name: 'yaml',
  title: 'YAML',
  extNames: ['yml', 'yaml'],
  mimes: ['application/yaml', 'application/x-yaml', 'text/yaml', 'text/x-yaml'],
  mimeExtensions: ['+yaml'],
  // YAML specification also allows UTF-32, but iconv-lite does not support it
  charsets: ['utf-8', 'utf-16', 'utf-16be', 'utf-16le'],
  // Infinity is handled even with yaml.JSON_SCHEMA
  jsonCompat: ['superset'],
  parse,
  serialize,
};
