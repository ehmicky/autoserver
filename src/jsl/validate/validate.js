'use strict';

// eslint-disable-next-line import/no-internal-modules
const { fullAncestor } = require('acorn/dist/walk');

const { parseNode, reverseParseNode } = require('../parse');
const { throwJslError } = require('../error');
const { isJsl } = require('../test');
const { getRawJsl } = require('../tokenize');

const { getGlobalKeys } = require('./global');
const allRules = require('./rules');

// Validate JSL by parsing it
const validateJsl = function ({ jsl, type }) {
  const jslText = getJsl({ jsl, type });
  const node = parseNode({ jslText, type });

  const globalKeys = getGlobalKeys({ type });
  const rules = allRules[type].getRules({ globalKeys });

  const throwJslErr = getThrowError({ jslText, type });
  const print = reverseParseNode.bind(null, jslText);
  const validate = validateNode.bind(null, { throwJslErr, print, rules });

  fullAncestor(node, validate);
};

const getJsl = function ({ jsl, type }) {
  const valIsJsl = isJsl({ jsl });

  if (!valIsJsl) {
    const message = `Invalid JSL: ${jsl}`;
    throwJslError({ type, message });
  }

  const jslText = getRawJsl({ jsl });
  return jslText;
};

// eslint-disable-next-line max-params
const validateNode = function (
  { throwJslErr, print, rules },
  node, parents, _, nodeType
) {
  // Verify it can be reversed parsed
  print(node);

  const rule = rules[nodeType];

  if (rule === true) { return; }

  if (!rule) {
    const msg = `Cannot use the following code: '${print(node)}'`;
    throwJslErr(msg);
  }

  checkNodeRule({ rule, node, parents, throwJslErr, print });
};

const checkNodeRule = function ({ rule, node, parents, throwJslErr, print }) {
  const nodeParents = parents.slice(0, parents.length - 1).reverse();
  const message = rule(node, nodeParents);

  if (typeof message === 'string') {
    throwJslErr(message);
  } else if (message === false) {
    const msg = `Cannot use the following code: '${print(node)}'`;
    throwJslErr(msg);
  }
};

const getThrowError = function ({ jslText, type }) {
  return msg => {
    const message = `Invalid inline function: '${jslText}'.
${msg}.
Please change the expression, or use a normal function instead.`;
    throwJslError({ type, message });
  };
};

module.exports = {
  validateJsl,
};
