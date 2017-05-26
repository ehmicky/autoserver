'use strict';


const { memoize } = require('../../../utilities');


// Rules to validate JSL defined in `arg.filter`
// Since it is meant to be parsed as a simple database query object,
// the rules are very restrictive:
//   - single expression, with no stuctures
//   - no variables, except JSL parameters
//   - only operators allowed: < <= > >= == != === !=== && || ! ?:
//   - only JSON types allowed, and Date (using new Date(string))
//   - two specific expressions are allowed: RegExp.test(string) and
//     Array.includes(value)
// TODO: validates sub-expression, e.g. ($ === ($ === 1)) should not be allowed
const getRules = memoize(({ globalKeys }) => ({

  Program({ start, body }) {
    if (start !== 0) {
      return 'Top-level expression is invalid';
    }
    if (body.length === 0) {
      return 'Must include at least one expression';
    }
    if (body.length > 1) {
      return 'Cannot include several statements';
    }
    const statement = body[0];
    if (statement.type !== 'ExpressionStatement') {
      return 'Top-level must be simple expression';
    }
  },

  Expression: true,
  Statement: true,
  ExpressionStatement({ expression: { type, value } }) {
    if (type === 'Literal' && value === 'use strict') {
      return 'Cannot use "use strict"';
    }
  },

  Identifier({ name }) {
    if (globalKeys.includes(name)) {
      return `No access to global state: cannot use '${name}'`;
    }
  },
  Literal(node, ancestors) {
    if (node.value instanceof RegExp) {
      if (node.regex.flags !== '') {
        return `Cannot use RegExp flags '${node.regex.flags}'`;
      }
      const isTest = isRegExpTest(ancestors[0]);
      if (!isTest) {
        return 'Can only use RegExps as RegExp.test(...)';
      }
    }
  },
  MemberExpression(node) {
    const isTest = isRegExpTest(node);
    const isIncludes = isArrayIncludes(node);
    if (!isTest && !isIncludes) { return false; }
  },
  ArrayExpression(node, ancestors) {
    const isIncludes = isArrayIncludes(ancestors[1]);
    if (!isIncludes) {
      return 'Can only use arrays as Array.includes(...)';
    }
  },

  UnaryExpression({ operator }) {
    if (!allowedUnaryOps.includes(operator)) {
      return `Cannot use '${operator}'`;
    }
  },
  BinaryExpression({ operator }) {
    if (!allowedBinaryOps.includes(operator)) {
      return `Cannot use '${operator}'`;
    }
  },
  LogicalExpression: true,
  ConditionalExpression: true,

  // Whitelist which function can be called:
  //  - RegExp.test(...)
  //  - Array.includes(...)
  CallExpression({ callee }) {
    const { type, name } = callee;

    const isTest = isRegExpTest(callee);
    const isIncludes = isArrayIncludes(callee);

    const isValidMemberExpression = isTest || isIncludes;
    if (!isValidMemberExpression && type !== 'Identifier') {
      return 'Function calls must be like: \'func(...)\'';
    }

    const isValidExpression = isTest || isIncludes;
    if (!isValidExpression) {
      if (name === 'Date') {
        return 'Use \'new Date(...)\' not \'Date(...)\'';
      }
      return `Cannot call '${name}(...)'`;
    }
  },

  // Whitelist which function can be called:
  //  - new Date(...)
  NewExpression(node) {
    const { callee, arguments: args } = node;
    const { name } = callee;

    const isDate = isDateFunc(node);
    if (isDate) {
      const isValidCall = args.length === 1 && args[0].type === 'Literal';
      if (!isValidCall) {
        return 'Must call Date() with single literal argument';
      }
      const date = new Date(args[0].value);
      const isInvalidDate = Number.isNaN(date.getTime());
      if (isInvalidDate) {
        return `Invalid date: ${args[0].value}`;
      }
    }

    const isValidExpression = isDate;
    if (!isValidExpression) {
      return `Cannot call '${name}(...)'`;
    }
  },
}));

const allowedUnaryOps = ['-', '+', '!'];
const allowedBinaryOps = ['<', '<=', '>', '>=', '==', '!=', '===', '!=='];

// Is a `RegExp.test(...)` expression
const isRegExpTest = function (node) {
  return node &&
    node.type === 'MemberExpression' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'test';
};

// Is a `Array.includes(...)` expression
const isArrayIncludes = function (node) {
  return node &&
    node.type === 'MemberExpression' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'includes' &&
    node.object.type === 'ArrayExpression';
};

// Is a `Date(...)` expression
const isDateFunc = function (node) {
  return node &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'Date';
};


module.exports = {
  filter: {
    getRules,
  },
};
