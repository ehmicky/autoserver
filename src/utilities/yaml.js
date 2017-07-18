'use strict';

const { readFile } = require('fs');
const { promisify } = require('util');

const yaml = require('js-yaml');

// Retrieve and parses a YAML file
// This might throw for many different reasons, e.g. wrong YAML syntax,
// or cannot access file (does not exist or no permissions)
const getYaml = async function ({ path, content }) {
  const yamlContent = await getYamlContent({ path, content });

  const data = yaml.load(yamlContent, {
    // YAML needs to JSON-compatible, since JSON must provide same
    // features as YAML
    schema: yaml.CORE_SCHEMA,
    json: true,
    // Error handling
    filename: path,
    onWarning (exception) {
      throw exception;
    },
  });
  return data;
};

const getYamlContent = async function ({ content, path }) {
  if (content) { return content; }

  const yamlContent = await promisify(readFile)(path, { encoding: 'utf-8' });
  return yamlContent;
};

module.exports = {
  getYaml,
};
