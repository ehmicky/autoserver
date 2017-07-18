'use strict';

const { base: walkBase } = require('acorn/dist/walk');

const { parseNode, reverseParseNode } = require('../parse');
const { throwJslError } = require('../error');
const { isJsl } = require('../test');
const { getRawJsl } = require('../tokenize');
const { getGlobalKeys } = require('./global');
const allRules = require('./rules');

// TODO: remove when https://github.com/ternjs/acorn/pull/559 is merged
const fullAncestor = function (node, callbackFunc, base, state) {
  if (!base) base = walkBase;
  let ancestors = [];

  (function crawl (child, st, override) {
    let type = override || child.type;
    let isNew = child !== ancestors[ancestors.length - 1];
    if (isNew) ancestors.push(child);
    base[type](child, st, crawl);
    callbackFunc(child, st || ancestors, ancestors, type);
    if (isNew) ancestors.pop();
  })(node, state);
};

// Validate JSL by parsing it
const validateJsl = function ({ jsl, type }) {
  const jslText = getJsl({ jsl, type });
  const node = parseNode({ jslText, type });

  const globalKeys = getGlobalKeys({ type });
  const rules = allRules[type].getRules({ globalKeys });

  const throwError = getThrowError({ jslText, type });
  const print = reverseParseNode.bind(null, jslText);
  const validate = validateNode.bind(null, { throwError, print, rules });

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

const validateNode = function (
  { throwError, print, rules },
  node, parents, _, nodeType
) {
  const rule = rules[nodeType];
  print(node);

  if (!rule) {
    const msg = `Cannot use the following code: '${print(node)}'`;
    throwError(msg);
  }

  if (rule === true) { return; }
  const nodeParents = parents.slice(0, parents.length - 1).reverse();
  const message = rule(node, nodeParents);

  if (typeof message === 'string') {
    throwError(message);
  } else if (message === false) {
    const msg = `Cannot use the following code: '${print(node)}'`;
    throwError(msg);
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
