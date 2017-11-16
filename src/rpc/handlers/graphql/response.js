'use strict';

const { omit, omitBy } = require('../../../utilities');

// Apply GraphQL-specific error response transformation
const transformSuccess = function ({
  response: { content: { metadata, ...content } },
}) {
  // According to GraphQL spec, extra metadata should be called `extensions`
  return { ...content, extensions: metadata };
};

// Apply GraphQL-specific error response transformation
const transformError = function ({
  response: { content: { data, metadata } },
}) {
  const errors = getError(data);

  // According to GraphQL spec, `data` should be `null` if `errors` is set
  return { data: null, errors, extensions: metadata };
};

// GraphQL spec error format
const getError = function ({
  type,
  title,
  description: message,
  details: stack,
  ...extraContent
}) {
  // Content following GraphQL spec
  // Custom information not following GraphQL spec is always rendered
  const error = { message, title, type, ...extraContent, stack };

  const errorA = omitBy(error, val => val === undefined);

  return [errorA];
};

module.exports = {
  transformSuccess,
  transformError,
};
