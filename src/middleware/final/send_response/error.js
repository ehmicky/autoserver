'use strict';

const { omit } = require('../../../utilities');
const { getStandardError } = require('../../../errors');

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ error, mInput, response }) {
  if (!error) { return response; }

  const content = getStandardError({ error, mInput });

  // Do not show stack trace in error responses
  const contentA = omit(content, 'details');

  return { type: 'error', content: contentA };
};

module.exports = {
  getErrorResponse,
};
