'use strict';

const yaml = require('js-yaml');
const { readFile } = require('fs');
const { promisify } = require('util');

// Retrieve and parses a YAML file
// This might throw for many different reasons, e.g. wrong YAML syntax,
// or cannot access file (does not exist or no permissions)
const getYaml = async function ({ path, content }) {
  if (!content) {
    content = await promisify(readFile)(path, { encoding: 'utf-8' });
  }
  const data = yaml.load(content, {
    // YAML needs to JSON-compatible, since JSON must provide same
    // features as YAML
    schema: yaml.CORE_SCHEMA,
    json: true,
    // Error handling
    filename: path,
    onWarning(exception) {
      throw exception;
    },
  });
  return data;
};

module.exports = {
  getYaml,
};
