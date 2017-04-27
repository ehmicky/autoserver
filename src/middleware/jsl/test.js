'use strict';


const { memoize } = require('../../utilities');


// Break down '  \\( jsl )  ' into tokens: '  ', '\', '(', ' jsl ', ')', '  '
const jslRegExp = /^(\s*)(\\?)(\()(.*)(\))(\s*)$/;
const tokenizeJsl = memoize(function ({ value }) {
  return jslRegExp.exec(value);
});

// Remove outer parenthesis from JSL
const getRawJsl = ({ value }) => {
  const parsedJsl = tokenizeJsl({ value });
  return parsedJsl[4];
};

// Test whether a value is JSL
const isJsl = ({ value }) => {
  return testJsl({ value }) === 'Jsl';
};
// Test whether a value is almost JSL, except opening parenthesis is escaped
const isEscapedJsl = ({ value }) => {
  return testJsl({ value }) === 'Escaped';
};
const testJsl = ({ value }) => {
  if (typeof value !== 'string') { return 'NotAString'; }
  const parsedJsl = tokenizeJsl({ value });
  if (!parsedJsl) { return 'NoParenthesis'; }
  const isEscaped = parsedJsl[2] === '\\';
  if (isEscaped) { return 'Escaped'; }
  return 'Jsl';
};


module.exports = {
  isJsl,
  isEscapedJsl,
  getRawJsl,
};
