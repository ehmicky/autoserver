'use strict';

const { getExtNames, findFormat, parse } = require('../formats');
const { throwError } = require('../error');

// Parse a generic configuration file
// We have to return promises because of a bug in `json-schema-ref-parser`
const genericParse = function ({ data, url }) {
  const content = Buffer.isBuffer(data) ? data.toString() : data;
  if (typeof content !== 'string') { return Promise.resolve(content); }

  const { name } = findFormat({ type: 'conf', path: url });
  const contentA = parse({ format: name, path: url, content });

  // `content` cannot be `null` because of a bug with `json-schema-ref-parser`
  if (contentA === null) {
    const message = `File '${url}' cannot be null`;
    throwError(message);
  }

  return Promise.resolve(contentA);
};

const canParse = getExtNames('conf').map(ext => `.${ext}`);

const genericRefs = {
  order: 100,
  allowEmpty: false,
  canParse,
  parse: genericParse,
};

module.exports = {
  genericRefs,
};
