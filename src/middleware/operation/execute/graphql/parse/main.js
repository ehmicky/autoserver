'use strict';

const { getMainDef, getFragments } = require('./main_def');
const { parseActions } = require('./actions');

const parse = function ({ queryDocument, operationName, goal, variables }) {
  const { selectionSet } = getMainDef({ queryDocument, operationName, goal });

  const fragments = getFragments({ queryDocument });

  const { actions } = parseActions({ selectionSet, fragments, variables });
  return actions;
};

module.exports = {
  parse,
};
