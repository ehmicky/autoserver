'use strict';

const { throwError } = require('../../error');

// Parse `args.orderBy` from a string to an array of objects
// E.g. 'a,b+,c-' would become:
//   [
//     { attrName: 'a', order: 'asc' },
//     { attrName: 'b', order: 'asc' },
//     { attrName: 'c', order: 'desc' },
//     { attrName: 'id', order: 'asc' },
//   ]
const parseOrderBy = function ({ actions }) {
  const actionsA = actions.map(action => parseAction({ action }));
  return { actions: actionsA };
};

const parseAction = function ({
  action,
  action: { args: { orderBy, ...args } },
}) {
  if (orderBy === undefined) { return action; }

  const orderByA = parseOrderByArg({ orderBy });

  return { ...action, args: { ...args, orderBy: orderByA } };
};

const parseOrderByArg = function ({ orderBy }) {
  const orderByA = orderBy
    // Remove whitespaces
    .replace(/\s+/g, '')
    // Multiple attributes sorting
    .split(',')
    // Transform each attribute to an object
    .map(getPart);
  const orderByB = addIdSorting({ orderBy: orderByA });
  return orderByB;
};

// Transform each part from a string to an object
// { attrName 'attr', order 'asc|desc' }
const getPart = function (part) {
  if (part === '') {
    const message = 'Argument \'order_by\' cannot have empty attributes';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const [, attrName, orderPostfix] = partsPostfixRegexp.exec(part);
  const order = orderPostfix === '-' ? 'desc' : 'asc';

  return { attrName, order };
};

// Matches attribute+ attribute- or attribute
const partsPostfixRegexp = /^([^+-]+)(\+|-)?$/;

// `orderBy` always include an id sorting. The reasons:
//   - it makes output predictable, the same request should always get
//     the same response
//   - the pagination layer needs this predictability
// If an `id` sorting is already specified, it does not add anything
const addIdSorting = function ({ orderBy }) {
  const hasId = orderBy.some(({ attrName }) => attrName === idOrder.attrName);
  if (hasId) { return orderBy; }

  return [...orderBy, idOrder];
};

const idOrder = { attrName: 'id', order: 'asc' };

module.exports = {
  parseOrderBy,
};
