'use strict';


const { omit } = require('lodash');


// Apply GraphQL-specific error transformation
const graphqlTransformResponse = function ({ content }) {
  const { type, title, description, details, status } = content;
  // Content following GraphQL spec
  const newContent = {
    message: description,
    title,
    type,
    status,
  };

  // Custom information not following GraphQL spec is always rendered
  const extraContent = omit(content, [
    'type',
    'title',
    'description',
    'details',
    'status',
  ]);
  Object.assign(newContent, extraContent, { stack: details });

  // Use Content-Type 'application/json' not 'application/problem+json'
  // in order to follow GraphQL spec
  const responseType = 'object';

  const response = {
    type: responseType,
    content: {
      errors: [newContent],
    },
  };

  return response;
};


module.exports = {
  graphqlTransformResponse,
};
