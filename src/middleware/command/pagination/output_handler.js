'use strict';

const { reverseArray } = require('../../../utilities');

const { validatePaginationOutput } = require('./validation');
const { mustPaginateOutput } = require('./condition');
const { getPaginationOutput } = require('./output');
const { getPaginationInfo } = require('./info');

// Add response metadata related to pagination:
//   token, page_size, has_previous_page, has_next_page
const handlePaginationOutput = function ({
  args,
  action,
  modelName,
  idl,
  response,
  runOpts: { maxPageSize },
}) {
  if (!mustPaginateOutput({ args })) { return; }

  const responseA = reverseOutput({ args, response });

  const paginationOutput = getPaginationOutput({ args, response: responseA });
  const responseB = { ...responseA, ...paginationOutput };

  validatePaginationOutput({
    args,
    action,
    modelName,
    maxPageSize,
    response: responseB,
    idl,
  });

  return { response: responseB };
};

// When using args.before, pagination is performed backward.
// We do this by inversing args.orderBy, which means we need to reverse output
// afterwards.
const reverseOutput = function ({ args, response }) {
  const { isBackward } = getPaginationInfo({ args });
  if (!isBackward) { return response; }

  const data = reverseArray(response.data);
  return { ...response, data };
};

module.exports = {
  handlePaginationOutput,
};
