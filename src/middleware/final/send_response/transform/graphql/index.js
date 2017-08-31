'use strict';

const { omit, omitBy } = require('../../../../../utilities');

// Apply GraphQL-specific error transformation
const transformErrorResponse = function ({
  response: {
    content: {
      type,
      title,
      description: message,
      details: stack,
      protocol_status: status,
      ...extraContent
    },
    type: contentType,
  },
}) {
  // Content following GraphQL spec
  // Custom information not following GraphQL spec is always rendered
  const extraContentA = omit(extraContent, 'status');
  const newContent = { message, title, type, status, ...extraContentA, stack };

  const cleanContent = omitBy(newContent, val => val === undefined);

  return {
    type: contentType,
    content: {
      errors: [cleanContent],
    },
  };
};

module.exports = {
  GraphQL: {
    transformErrorResponse,
  },
};
