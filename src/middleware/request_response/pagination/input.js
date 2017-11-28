'use strict';

const { isOffset, getLimit } = require('./info');
const { getTokenFilter } = require('./filter');
const { getBackwardOrder } = require('./backward');

// Transform args.pagesize|before|after|page into args.limit|offset|filter
const getPaginationInput = function ({ args, token, runOpts }) {
  const argsA = getInput({ args, token, runOpts });
  const argsB = { ...args, ...argsA };
  return argsB;
};

const getInput = function ({ args, token, runOpts }) {
  if (isOffset({ args })) {
    return getOffsetInput({ args, runOpts });
  }

  return getTokensInput({ args, token, runOpts });
};

const getOffsetInput = function ({ args, args: { page }, runOpts }) {
  const limit = getLimit({ args, runOpts });
  const offset = (page - 1) * (limit - 1);

  return { limit, offset };
};

const getTokensInput = function ({ args, token, runOpts }) {
  const tokenInput = getTokenFilter({ args, token });
  const order = getBackwardOrder({ args });
  const limit = getLimit({ args, runOpts });
  return { ...tokenInput, ...order, limit };
};

module.exports = {
  getPaginationInput,
};
