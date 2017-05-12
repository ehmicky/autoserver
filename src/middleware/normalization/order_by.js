'use strict';


const { EngineError } = require('../../error');


/**
 * Normalize arg.order_by, e.g. 'a,b+,c-' would become:
 *   [
 *     { attrName: 'a', order: 'asc' },
 *     { attrName: 'b', order: 'asc' },
 *     { attrName: 'c', order: 'desc' },
 *     { attrName: 'id', order: 'asc' },
 *   ]
 **/
const normalizeOrderBy = function ({ orderBy, messagePrefix = '' }) {
  if (typeof orderBy !== 'string') {
    throw new EngineError(`${messagePrefix} argument 'order_by' must be a string: ${orderBy}`, { reason: 'INPUT_VALIDATION' });
  }

  // Remove whitespaces
  const noWhitespaceOrderBy = orderBy.replace(/\s+/g, '');

  // Multiple attributes sorting
  const parts = noWhitespaceOrderBy.split(',');

  // Transform each part from a string to an object { attrName 'attr', order 'asc|desc' }
  const parsedParts = parts.map(part => {
    if (part === '') {
      throw new EngineError(`${messagePrefix} argument 'order_by' cannot have empty attributes`, {
        reason: 'INPUT_VALIDATION',
      });
    }

    // Default order is +
    const partWithPrefix = partsPostfixRegexp.test(part) ? part : `${part}+`;
    // Parse the + or - postfix
    const [,attrName, orderPostfix] = partsPostfixRegexp.exec(partWithPrefix);
    const order = orderPostfix === '-' ? 'desc' : 'asc';
    return { attrName, order };
  });

  // order_by always include an id sorting. The reasons:
  //   - make output predictable, the same request should always get the same response
  //   - the pagination layer needs this predictability
  // If an id sorting is already specified, do not need to do anything
  const hasId = parsedParts.some(({ attrName }) => attrName === 'id');
  if (!hasId) {
    parsedParts.push({ attrName: 'id', order: 'asc' });
  }

  return parsedParts;
};

// Matches attribute+ attribute- or attribute
const partsPostfixRegexp = /^(.*)(\+|-)$/;


module.exports = {
  normalizeOrderBy,
};
