'use strict';


const { tokenizeJsl } = require('./tokenize');


// Test whether a value is JSL
const isJsl = ({ jsl }) => testJsl({ jsl }) === 'Jsl';

// Test whether a value is almost JSL, except opening parenthesis is escaped
const isEscapedJsl = ({ jsl }) => testJsl({ jsl }) === 'Escaped';

const testJsl = ({ jsl }) => {
  if (typeof jsl !== 'string') { return 'NotAString'; }
  const parsedJsl = tokenizeJsl({ jsl });
  if (!parsedJsl) { return 'NoParenthesis'; }
  const isEscaped = parsedJsl[2] === '\\';
  if (isEscaped) { return 'Escaped'; }
  return 'Jsl';
};


module.exports = {
  isJsl,
  isEscapedJsl,
};
