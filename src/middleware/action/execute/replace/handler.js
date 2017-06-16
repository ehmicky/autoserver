'use strict';


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
const replaceAction = async function replaceAction(input) {
  const { log } = input;
  const perf = log.perf.start('action.replace', 'middleware');

  const readInput = getReadInput({ input });

  perf.stop();
  const { data: models } = await this.next(readInput);
  perf.start();

  const updateInput = getUpdateInput({ input, models });

  perf.stop();
  const response = await this.next(updateInput);

  return response;
};


module.exports = {
  replaceAction,
};
