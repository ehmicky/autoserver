'use strict';

const { omit, omitBy } = require('../../../utilities');

// Apply GraphQL-specific response transformation
const transformResponse = function ({ type, content, content: { error } }) {
  if (type !== 'error') { return content; }

  const errors = getError(error);

  // According to GraphQL spec, `data` should be `null` if `errors` is set
  return { data: null, errors };
};

// GraphQL spec error format
const getError = function ({
  type,
  title,
  description: message,
  details: stack,
  protocolstatus: status,
  ...extraContent
}) {
  // Content following GraphQL spec
  // Custom information not following GraphQL spec is always rendered
  const extraContentA = omit(extraContent, 'status');
  const error = { message, title, type, status, ...extraContentA, stack };

  const errorA = omitBy(error, val => val === undefined);

  return [errorA];
};

module.exports = {
  transformResponse,
};
