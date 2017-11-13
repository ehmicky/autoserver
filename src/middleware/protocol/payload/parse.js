'use strict';

const { addGenErrorHandler } = require('../../../error');
const { parse } = require('../../../formats');

// Parse content, e.g. JSON/YAML parsing
const parseContent = function ({ format: { name }, payload }) {
  if (name === undefined) { return payload; }

  return parse({ format: name, content: payload });
};

const eParseContent = addGenErrorHandler(parseContent, {
  message: ({ format: { title } }) => `The request payload is not valid ${title}`,
  reason: 'WRONG_CONTENT_TYPE',
});

module.exports = {
  parseContent: eParseContent,
};
