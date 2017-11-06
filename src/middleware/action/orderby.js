'use strict';

const { throwError } = require('../../error');

// Parse `args.orderby` from a string to an array of objects
// E.g. 'a,b+,c-' would become:
//   [
//     { attrName: 'a', order: 'asc' },
//     { attrName: 'b', order: 'asc' },
//     { attrName: 'c', order: 'desc' },
//     { attrName: 'id', order: 'asc' },
//   ]
const parseOrderby = function ({ actions }) {
  const actionsA = actions.map(action => parseAction({ action }));
  return { actions: actionsA };
};

const parseAction = function ({
  action,
  action: { args: { orderby, ...args } },
}) {
  if (orderby === undefined) { return action; }

  const orderbyA = parseOrderbyArg({ orderby });

  return { ...action, args: { ...args, orderby: orderbyA } };
};

const parseOrderbyArg = function ({ orderby }) {
  const orderbyA = orderby
    // Remove whitespaces
    .replace(/\s+/g, '')
    // Multiple attributes sorting
    .split(',')
    // Transform each attribute to an object
    .map(getPart);
  const orderbyB = addIdSorting({ orderby: orderbyA });
  return orderbyB;
};

// Transform each part from a string to an object
// { attrName 'attr', order 'asc|desc' }
const getPart = function (part) {
  if (part === '') {
    const message = 'Argument \'orderby\' cannot have empty attributes';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const [, attrName, orderPostfix] = PARTS_POSTFIX_REGEXP.exec(part);
  const order = orderPostfix === '-' ? 'desc' : 'asc';

  return { attrName, order };
};

// Matches attribute+ attribute- or attribute
const PARTS_POSTFIX_REGEXP = /^([^+-]+)(\+|-)?$/;

// `orderby` always include an id sorting. The reasons:
//   - it makes output predictable, the same request should always get
//     the same response
//   - the pagination layer needs this predictability
// If an `id` sorting is already specified, it does not add anything
const addIdSorting = function ({ orderby }) {
  const hasId = orderby.some(({ attrName }) => attrName === ID_ORDER.attrName);
  if (hasId) { return orderby; }

  return [...orderby, ID_ORDER];
};

const ID_ORDER = { attrName: 'id', order: 'asc' };

module.exports = {
  parseOrderby,
};
