'use strict';


const { normalizeFilter } = require('./filter');
const { normalizeOrderBy } = require('./order_by');


/**
 * Normalize input, i.e. when input can take several shapes,
 * reduce it to a single shape
 **/
const normalization = async function () {
  return async function normalization(input) {
    const { args, action, modelName } = input;

    const prefix = `In action '${action}', model '${modelName}',`;
    if (args.filter) {
      args.filter = normalizeFilter({ filter: args.filter, prefix });
    }

    if (args.order_by) {
      args.order_by = normalizeOrderBy({ orderBy: args.order_by, prefix });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  normalization,
};
