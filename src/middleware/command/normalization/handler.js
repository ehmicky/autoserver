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
    const { orderBy, filter } = args;
    const perf = log.perf.start('command.normalization', 'middleware');

    if (filter) {
      args.nFilter = normalizeFilter({ filter });
    }

    if (orderBy) {
      args.nOrderBy = normalizeOrderBy({ orderBy });
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  normalization,
};
