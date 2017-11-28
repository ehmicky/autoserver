'use strict';

const { throwError } = require('../../error');

// Parse `args.order` from a string to an array of objects
// E.g. 'a,b+,c-' would become:
//   [
//     { attrName: 'a', dir: 'asc' },
//     { attrName: 'b', dir: 'asc' },
//     { attrName: 'c', dir: 'desc' },
//     { attrName: 'id', dir: 'asc' },
//   ]
const parseOrder = function ({ actions }) {
  const actionsA = actions.map(action => parseAction({ action }));
  return { actions: actionsA };
};

const parseAction = function ({
  action,
  action: { args: { order, ...args } },
}) {
  const orderA = parseOrderArg({ order });

  return { ...action, args: { ...args, order: orderA } };
};

const parseOrderArg = function ({ order }) {
  if (order === undefined) { return ID_ORDER; }

  const orderA = order
    // Remove whitespaces
    .replace(/\s+/g, '')
    // Multiple attributes sorting
    .split(',')
    // Transform each attribute to an object
    .map(getPart);
  const orderB = addIdSorting({ order: orderA });
  return orderB;
};

// Transform each part from a string to an object
// { attrName 'attr', dir 'asc|desc' }
const getPart = function (part) {
  if (part === '') {
    const message = 'Argument \'order\' cannot have empty attributes';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const [, attrName, dirPostfix] = PARTS_POSTFIX_REGEXP.exec(part);
  const dir = dirPostfix === '-' ? 'desc' : 'asc';

  return { attrName, dir };
};

// Matches attribute+ attribute- or attribute
const PARTS_POSTFIX_REGEXP = /^([^+-]+)(\+|-)?$/;

// `order` always include an id sorting. The reasons:
//   - it makes output predictable, the same request should always get
//     the same response
//   - the pagination layer needs this predictability
// If an `id` sorting is already specified, it does not add anything
const addIdSorting = function ({ order }) {
  const hasId = order.some(({ attrName }) => attrName === ID_ORDER[0].attrName);
  if (hasId) { return order; }

  return [...order, ...ID_ORDER];
};

// 'patch' is always sorted by 'id', i.e. user cannot specify it
// The reason: it might otherwise iterate over the same models
// For 'delete', sorting is an unnecessary feature, so we keep it similar to
// 'patch' command.
const ID_ORDER = [{ attrName: 'id', dir: 'asc' }];

module.exports = {
  parseOrder,
};
