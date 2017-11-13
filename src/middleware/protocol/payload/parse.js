'use strict';

const { addGenErrorHandler } = require('../../../error');

// Parse content, e.g. JSON/YAML parsing
const parseContent = function ({ format: { parse }, payload }) {
  if (parse === undefined) { return payload; }

  return parse({ content: payload });
};

const eParseContent = addGenErrorHandler(parseContent, {
  message: ({ format: { title } }) => `The request payload is not valid ${title}`,
  reason: 'WRONG_CONTENT_TYPE',
});

module.exports = {
  parseContent: eParseContent,
};
