'use strict';

const { isOffset, getLimit } = require('../info');
const { getBackwardOrder } = require('../backward');

const { getTokenFilter } = require('./filter');

// Transform args.pagesize|before|after|page into args.limit|offset|filter
const getPaginationInput = function ({ args, token, schema }) {
  const argsA = getInput({ args, token, schema });
  const argsB = { ...args, ...argsA };
  return argsB;
};

const getInput = function ({ args, token, schema }) {
  if (isOffset({ args })) {
    return getOffsetInput({ args, schema });
  }

  return getTokensInput({ args, token, schema });
};

const getOffsetInput = function ({ args, args: { page }, schema }) {
  const limit = getLimit({ args, schema });
  const offset = (page - 1) * (limit - 1);

  return { limit, offset };
};

const getTokensInput = function ({ args, token, schema }) {
  const tokenInput = getTokenFilter({ args, token });
  const order = getBackwardOrder({ args });
  const limit = getLimit({ args, schema });
  return { ...tokenInput, ...order, limit };
};

module.exports = {
  getPaginationInput,
};
