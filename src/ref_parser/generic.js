'use strict';

const { generic } = require('../formats');
const { throwError } = require('../error');

// Parse a generic configuration file
const parse = async function ({ data, url }) {
  const content = Buffer.isBuffer(data) ? data.toString() : data;
  if (typeof content !== 'string') { return content; }

  const contentA = await generic.load({ path: url, content });

  // `content` cannot be `null` because of a bug with `json-schema-ref-parser`
  if (contentA === null) {
    const message = `File '${url}' cannot be null`;
    throwError(message);
  }

  return contentA;
};

const canParse = generic.extNames.map(ext => `.${ext}`);

const genericRefs = {
  order: 100,
  allowEmpty: false,
  canParse,
  parse,
};

module.exports = {
  genericRefs,
};
