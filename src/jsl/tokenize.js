'use strict';


// Break down '  \\( jsl )  ' into tokens: '  ', '\', '(', ' jsl ', ')', '  '
const jslRegExp = /^(\s*)(\\?)(\()(.*)(\))(\s*)$/;
const tokenizeJsl = ({ jsl }) => jslRegExp.exec(jsl);

// Remove outer parenthesis from JSL
const getRawJsl = ({ jsl }) => tokenizeJsl({ jsl })[4];


module.exports = {
  tokenizeJsl,
  getRawJsl,
  jslRegExp,
};
