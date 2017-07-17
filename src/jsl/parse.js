'use strict';

const { parse } = require('acorn');

const { throwJslError } = require('./error');
const { memoizeUnlessClient } = require('./memoize');

// Parse JSL into a top-level node
const parseNode = memoizeUnlessClient(function ({ jslText, type }) {
  try {
    return parse(jslText);
  } catch (innererror) {
    const message = `JSL syntax error: '${jslText}'`;
    throwJslError({ message, type, innererror });
  }
});

// Reverse parse an AST node
const reverseParseNode = function (jslText, node) {
  return jslText.slice(node.start, node.end);
};

module.exports = {
  parseNode,
  reverseParseNode,
};
