'use strict';

const { addGenErrorHandler } = require('../../../error');

// Parse content, e.g. JSON/YAML parsing
const fireParser = function ({ format: { parse }, payload }) {
  if (parse === undefined) { return payload; }

  return parse({ content: payload });
};

const eFireParser = addGenErrorHandler(fireParser, {
  message: ({ format: { title } }) => `The request payload is not valid ${title}`,
  reason: 'WRONG_CONTENT_TYPE',
});

module.exports = {
  fireParser: eFireParser,
};
