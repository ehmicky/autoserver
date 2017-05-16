'use strict';


const { cloneDeep, pick } = require('lodash');

const { getFilter } = require('./filter');


// Retrieves the input for the second "find" database action
// It is used for final output of "upsert"
const getSecondFindInput = function ({ input, prefix }) {
  input = cloneDeep(input);

  const actionType = 'find';
  const action = input.action === 'upsertMany' ? 'findMany' : 'findOne';
  const args = getFindArgs({ input, prefix });

  Object.assign(input, { actionType, action, args });
  Object.assign(input.info, { actionType });

  return input;
};

// Only keep args: { filter, order_by, page_size }
const getFindArgs = function ({ input, prefix }) {
  const findArgs = pick(input.args, ['order_by', 'page_size']);
  const filter = getFilter({ input, prefix });

  Object.assign(findArgs, { filter });
  return findArgs;
};


module.exports = {
  getSecondFindInput,
};
