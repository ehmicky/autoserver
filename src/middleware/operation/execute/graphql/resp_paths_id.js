'use strict';

const { throwError } = require('../../../../error');

const addRespPathsIds = function ({ actions }) {
  return actions.map(addActionRespPathsIds);
};

const addActionRespPathsIds = function (action) {
  const { respPaths, args: { data } } = action;

  if (data === undefined) { return action; }

  if (!Array.isArray(data) || data.length !== respPaths.length) {
    const message = `'args.data' should have same length as 'respPaths'`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  const respPathsA = respPaths
    .map((respPath, index) => addRespPathIds({ respPath, data: data[index] }));
  return { ...action, respPaths: respPathsA };
};

const addRespPathIds = function ({ respPath, data: { id } }) {
  if (!Array.isArray(respPath) || typeof id !== 'string') {
    const message = 'Cannot calculate \'respPath\' id';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  return { id, path: respPath };
};

module.exports = {
  addRespPathsIds,
};
