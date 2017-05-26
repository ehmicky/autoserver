'use strict';


const { base: walkBase } = require('acorn/dist/walk');

const { parseNode } = require('../parse');
const { throwJslError } = require('../error');
const { isJsl } = require('../test');
const { getRawJsl } = require('../tokenize');
const { getGlobalKeys } = require('./global');
const allRules = require('./rules');
const { printNode } = require('./print');


// TODO: remove when https://github.com/ternjs/acorn/pull/559 is merged
const fullAncestor = function (node, callback, base, state) {
   if (!base) base = walkBase;
   let ancestors = []
   ;(function c(node, st, override) {
     let type = override || node.type;
     let isNew = node != ancestors[ancestors.length - 1];
     if (isNew) ancestors.push(node);
     base[type](node, st, c);
     callback(type, node, st || ancestors, ancestors);
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
  const validate = validateNode.bind(null, throwError, rules);

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

const validateNode = function (throwError, rules, nodeType, node, ancestors) {
  const rule = rules[nodeType];
  if (!rule) {
    const message = `Cannot use the following code: '${printNode(node)}'`;
    throwError(message);
  }

  if (rule === true) { return; }

  const nodeAncestors = ancestors.reverse().slice(1);
  const message = rule(node, nodeAncestors);
  if (typeof message === 'string') {
    throwError(message);
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
