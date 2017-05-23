'use strict';


const { omitBy, cloneDeep } = require('lodash');

const { isDev } = require('../../utilities');


// Creates protocol-independent response error, using an error object
const getResponse = function ({ error }) {
  const {
    reason: type,
    title,
    message: description,
    instance,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra,
    transforms = [],
  } = error;

  // Order matters, as this will be kept in final output
  const content = { type, title, description, instance };
  // Any custom information
  Object.assign(content, extra);
  // Stack trace is always at the end
  Object.assign(content, { details });

  // Do not expose undefined values
  const errorObj = omitBy(content, val => val === undefined);

  const response = { type: 'error', content: cloneDeep(errorObj) };

  // Remove development-related information, but only for the response sent
  // to client, not the error sent reported by system (`errorObj`)
  if (!isDev()) {
    delete response.content.details;
  }

  // E.g. interface-specific error format, e.g. GraphQL
  const transformedResponse = transforms.reduce((resp, transform) => {
    return transform(resp);
  }, response);

  return { errorObj, transformedResponse };
};


module.exports = {
  getResponse,
};
