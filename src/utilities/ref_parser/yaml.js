'use strict';

const { loadYaml } = require('../yaml');
const { throwError } = require('../error');

// We need to override YAML parsing, as we use stricter YAML parsing
// (CORE_SCHEMA only)
const parseYaml = async function ({ data, url }) {
  const content = Buffer.isBuffer(data) ? data.toString() : data;
  if (typeof content !== 'string') { return content; }

  const yamlContent = await loadYaml({ path: url, content });

  // `content` cannot be `null` because of a bug
  // with `json-schema-ref-parser`
  if (yamlContent === null) {
    const message = `File '${url}' cannot be null`;
    throwError(message);
  }

  return yamlContent;
};

const yamlRefs = {
  parse: {
    allowEmpty: false,
    parse: parseYaml,
  },
};

module.exports = {
  yamlRefs,
};
