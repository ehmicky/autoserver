'use strict';


const { normalizeFilter } = require('./filter');
const { normalizeOrderBy } = require('./order_by');


/**
 * Normalize input, i.e. when input can take several shapes,
 * reduce it to a single shape
 **/
const normalization = function () {
  return async function normalization(input) {
    const { args, log } = input;
    const perf = log.perf.start('command.normalization', 'middleware');

    if (args.filter) {
      args.filter = normalizeFilter({ filter: args.filter });
    }

    if (args.order_by) {
      args.order_by = normalizeOrderBy({ orderBy: args.order_by });
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  normalization,
};
