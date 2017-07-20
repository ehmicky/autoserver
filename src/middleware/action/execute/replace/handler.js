'use strict';

const { renameThis } = require('../rename_this');

const { getReadInput } = require('./read');
const { getUpdateInput } = require('./update');

/**
 * "replace" action is split into two commands:
 *   - first a "read" command retrieving current models
 *     Pagination is disabled for that query.
 *   - then a "update" command
 * The reasons why we split "replace" action are:
 *   - we need to know the current models so we can set args.currentData
 **/
const replaceAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const actions = [
  {
    input: getReadInput,
  },
  {
    input: getUpdateInput,
  },
];

module.exports = {
  replaceAction,
};
