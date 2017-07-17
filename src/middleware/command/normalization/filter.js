'use strict';

const { isJsl } = require('../../../jsl');
const { EngineError } = require('../../../error');
const { mapValues } = require('../../../utilities');

/**
 * Normalize args.filter, since it can take three shapes:
 *   1) { filter: { attr: 1 } }
 *   2) { filter: { attr: '($ === 1)' } }
 *   3) { filter: '($$.attr === 1)' }
 * Normalize the shape number 3, i.e. args.filter will always be a string
 * from that point, not an object.
 **/
const normalizeFilter = function ({ filter }) {
  // Already { filter: '($$.attr === 1)' }
  if (isJsl({ jsl: filter })) { return filter; }

  if (filter.constructor !== Object) {
    const message = 'Argument \'filter\' format is invalid';
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  // { filter: { attr: 1 } } -> { filter: { attr: '($ === 1)' } }
  const jslOnlyFilter = mapValues(filter, filterVal => {
    if (isJsl({ jsl: filterVal })) { return filterVal; }
    return `($ === ${JSON.stringify(filterVal)})`;
  });

  // { filter: { attr: '($ === 1)', attrb: '($ === 2)' } }
  // -> { filter: '(($$.attr === 1) && ($$.attrb === 2))' }
  const singleJslArray = Object.entries(jslOnlyFilter).map(normalizeJsl);
  const nFilter = `(${singleJslArray.join(' && ')})`;

  return nFilter;
};
// Look for single dollar parameter ($), while exclusing double dollar
// parameters ($$) or normal parameters ($example)
// TODO: use a JavaScript parser instead
const singleDollarRegExp = /([^$a-zA-Z0-9_])\$(?![$a-zA-Z0-9_])/g;
const normalizeJsl = function ([attrName, attrJsl]) {
  return attrJsl.replace(singleDollarRegExp, `$1$$$$.${attrName}`);
};

module.exports = {
  normalizeFilter,
};
