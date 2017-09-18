'use strict';

const { throwError } = require('../../../../error');

const addResponsesIds = function ({ actions }) {
  return actions.map(addActionResponsesIds);
};

const addActionResponsesIds = function (action) {
  const { responses, args: { data } } = action;

  if (data === undefined) { return action; }

  if (!Array.isArray(data) || data.length !== responses.length) {
    const message = `'args.data' should have same length as 'responses'`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  const responsesA = responses
    .map((response, index) => addResponseIds({ response, data: data[index] }));
  return { ...action, responses: responsesA };
};

const addResponseIds = function ({ response, data: { id } }) {
  if (!Array.isArray(response) || typeof id !== 'string') {
    const message = 'Cannot calculate \'response\' id';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  return { id, path: response };
};

module.exports = {
  addResponsesIds,
};
