'use strict';

const { validateSameType, parseAsIs } = require('./common');
const { parseOr, parseAnd, evalOr, evalAnd } = require('./or_and');
const {
  parseLikeNlike,
  validateLikeNlike,
  evalLike,
  evalNlike,
} = require('./like_nlike');
const {
  parseSomeAll,
  validateSomeAll,
  evalAll,
  evalSome,
} = require('./some_all');
const { validateInNin, evalIn, evalNin } = require('./in_nin');
const { evalEq, evalNeq } = require('./eq_neq');
const { evalGt, evalGte, evalLt, evalLte } = require('./lt_gt_lte_gte');

const operators = {
  or: { parse: parseOr, eval: evalOr },
  and: { parse: parseAnd, eval: evalAnd },
  eq: { parse: parseAsIs, validate: validateSameType, eval: evalEq },
  neq: { parse: parseAsIs, validate: validateSameType, eval: evalNeq },
  in: { parse: parseAsIs, validate: validateInNin, eval: evalIn },
  nin: { parse: parseAsIs, validate: validateInNin, eval: evalNin },
  lte: { parse: parseAsIs, validate: validateSameType, eval: evalLte },
  lt: { parse: parseAsIs, validate: validateSameType, eval: evalLt },
  gte: { parse: parseAsIs, validate: validateSameType, eval: evalGte },
  gt: { parse: parseAsIs, validate: validateSameType, eval: evalGt },
  like: { parse: parseLikeNlike, validate: validateLikeNlike, eval: evalLike },
  nlike: {
    parse: parseLikeNlike,
    validate: validateLikeNlike,
    eval: evalNlike,
  },
  some: { parse: parseSomeAll, validate: validateSomeAll, eval: evalSome },
  all: { parse: parseSomeAll, validate: validateSomeAll, eval: evalAll },
};

module.exports = {
  operators,
};
