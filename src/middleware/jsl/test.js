'use strict';


// Looks for unescaped `$` to find $variables
const jslRegExp = /((?:(?:[^\\])\$)|(?:^\$))([^{]|$)/g;
const jslRegExpTest = /((?:(?:[^\\])\$)|(?:^\$))([^{]|$)/;
// Test whether a value looks like JSL
const testJsl = ({ value }) => typeof value === 'string' && jslRegExpTest.test(value);


module.exports = {
  testJsl,
  jslRegExp,
};
