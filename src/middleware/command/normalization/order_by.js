'use strict';

const { throwError } = require('../../../error');

/**
 * Normalize args.orderBy, e.g. 'a,b+,c-' would become:
 *   [
 *     { attrName: 'a', order: 'asc' },
 *     { attrName: 'b', order: 'asc' },
 *     { attrName: 'c', order: 'desc' },
 *     { attrName: 'id', order: 'asc' },
 *   ]
 **/
const normalizeOrderBy = function ({
  input,
  input: { args, args: { orderBy }, modelName, idl: { models } },
}) {
  if (!orderBy) { return input; }

  if (typeof orderBy !== 'string') {
    const message = 'Argument \'order_by\' must be a string';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const attrNames = Object.keys(models[modelName].attributes);
  const nOrderBy = getNOrderBy({ orderBy, attrNames });

  return { ...input, args: { ...args, nOrderBy } };
};

const getNOrderBy = function ({ orderBy, attrNames }) {
  // Remove whitespaces
  const noWhitespaceOrderBy = orderBy.replace(/\s+/g, '');

  // Multiple attributes sorting
  const parts = noWhitespaceOrderBy.split(',');

  // Transform each part from a string to an object
  // { attrName 'attr', order 'asc|desc' }
  const nOrderBy = parts.map(part => getPart({ part, attrNames }));

  // `orderBy` always include an id sorting. The reasons:
  //   - make output predictable, the same request should always get
  //     the same response
  //   - the pagination layer needs this predictability
  // If an id sorting is already specified, do not need to do anything
  const hasId = nOrderBy.some(({ attrName }) => attrName === idOrder.attrName);

  const finalNOrderBy = hasId ? nOrderBy : [...nOrderBy, idOrder];

  return finalNOrderBy;
};

const getPart = function ({ part, attrNames }) {
  if (part === '') {
    const message = 'Argument \'order_by\' cannot have empty attributes';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const { attrName, order } = parsePart({ part });

  if (!attrNames.includes(attrName)) {
    const message = `Argument 'order_by' attribute '${attrName}' does not exist`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { attrName, order };
};

const parsePart = function ({ part }) {
  // Default order is +
  const partWithPrefix = partsPostfixRegexp.test(part) ? part : `${part}+`;
  // Parse the + or - postfix
  const [, attrName, orderPostfix] = partsPostfixRegexp.exec(partWithPrefix);
  const order = orderPostfix === '-' ? 'desc' : 'asc';

  return { attrName, order };
};

const idOrder = { attrName: 'id', order: 'asc' };

// Matches attribute+ attribute- or attribute
const partsPostfixRegexp = /^(.*)(\+|-)$/;

module.exports = {
  normalizeOrderBy,
};
