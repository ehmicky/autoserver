'use strict';


const { omit, omitBy } = require('../../../../../utilities');


// Apply GraphQL-specific error transformation
const transformResponse = function ({ response: { content } }) {
  const {
    type,
    title,
    description,
    details,
    protocol_status: protocolStatus,
  } = content;
  // Content following GraphQL spec
  const newContent = {
    message: description,
    title,
    type,
    status: protocolStatus,
  };

  // Custom information not following GraphQL spec is always rendered
  const extraContent = omit(content, [
    'type',
    'title',
    'description',
    'details',
    'status',
    'protocol_status',
  ]);
  Object.assign(newContent, extraContent, { stack: details });

  const cleanContent = omitBy(newContent, val => val === undefined);

  // Use Content-Type 'application/json' not 'application/problem+json'
  // in order to follow GraphQL spec
  const responseType = 'object';

  const transformedResponse = {
    type: responseType,
    content: {
      errors: [cleanContent],
    },
  };

  return transformedResponse;
};


module.exports = {
  GraphQL: {
    transformResponse,
  },
};
