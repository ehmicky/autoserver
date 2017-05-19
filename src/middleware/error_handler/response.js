'use strict';


const { omitBy } = require('lodash');

const { isDev } = require('../../utilities');


// Creates protocol-independent response error, using an error object
const getResponse = function ({ error }) {
  const {
    reason: type,
    title,
    message: description,
    instance,
    stack,
    innererror: { stack: details = stack } = {},
    extra,
    transforms = [],
  } = error;

  // Order matters, as this will be kept in final output
  const content = { type, title, description, instance };
  // Any custom information
  Object.assign(content, extra);
  // Stack trace is always at the end
  if (isDev()) {
    Object.assign(content, { details });
  }

  // Do not expose undefined values
  const cleanContent = omitBy(content, val => val === undefined);

  const response = { type: 'error', content: cleanContent };

  const transformedResponse = transforms.reduce((resp, transform) => {
    return transform(resp);
  }, response);

  return transformedResponse;
};


module.exports = {
  getResponse,
};
