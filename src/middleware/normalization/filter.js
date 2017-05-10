'use strict';


const { isJsl } = require('../../jsl');
const { EngineError } = require('../../error');
const { map } = require('../../utilities');


/**
 * Normalize arg.filter, since it can take three shapes:
 *   1) { filter: { attr: 1 } }
 *   2) { filter: { attr: '($ === 1)' } }
 *   3) { filter: '($$.attr === 1)' }
 * Normalize the shape number 3, i.e. arg.filter will always be a string from that point, not an object.
 **/
const normalizeFilter = function ({ filter, messagePrefix = '' }) {
  // Already { filter: '($$.attr === 1)' }
  if (isJsl({ jsl: filter })) { return filter; }

  if (filter.constructor !== Object) {
    throw new EngineError(`${messagePrefix} argument 'filter' format is invalid: ${filter}`, { reason: 'INPUT_VALIDATION' });
  }

  // { filter: { attr: 1 } } -> { filter: { attr: '($ === 1)' } }
  const jslOnlyFilter = map(filter, filterVal => {
    if (isJsl({ jsl: filterVal })) { return filterVal; }
    return `($ === ${JSON.stringify(filterVal)})`;
  });

  // { filter: { attr: '($ === 1)', attrb: '($ === 2)' } } -> { filter: '(($$.attr === 1) && ($$.attrb === 2))' }
  const singleJslArray = Object.entries(jslOnlyFilter).map(([attrName, attrJsl]) => {
    return attrJsl.replace(singleDollarRegExp, `$1$$$$.${attrName}`);
  });
  const singleJslString = `(${singleJslArray.join(' && ')})`;

  return singleJslString;
};
// Look for single dollar variables ($), while exclusing double dollar variables ($$) or normal variables ($var)
// TODO: use a JavaScript parser instead
const singleDollarRegExp = /([^$a-zA-Z0-9_])\$(?![$a-zA-Z0-9_])/g;


module.exports = {
  normalizeFilter,
};
