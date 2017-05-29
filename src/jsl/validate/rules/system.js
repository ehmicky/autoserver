'use strict';


const { memoize } = require('../../../utilities');


// Rules to validate JSL defined in IDL file.
// Each type is a node type.
// If the node type is missing, it means it is not allowed.
// Node types can be functions to create custom validation per type.
// General idea:
//  - functions should be pure, so we can memoize them, and to prevent
//    security risks
//     - no side-effects, including assignments and declarations
//     - no access to global state
//  - functions should be synchronous
//  - functions should be short and simple.
//    If one needs more complexity, use non-inline function instead.
//    This is also to prevent security risks (DDoS with expensive or
//    long-running operations)
//     - single expression
//     - no structures
//     - functions must be arrow functions
//     - function calls must be `func()` or `obj.func()`
//     - no classes, generators, ArrayBuffer, TypedArray, Map, Set, SIMD, Proxy,
//       Reflect or debugger
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

  // Functions are allowed, but only arrow functions because no declarations
  Function: true,
  ArrowFunctionExpression: true,

  Pattern: true,
  Identifier({ name }) {
    if (globalKeys.includes(name)) {
      return `No access to global state: cannot use '${name}'`;
    }
  },
  MemberExpression: true,
  ObjectPattern: true,
  Property: true,
  AssignmentProperty: true,
  ArrayPattern: true,
  RestElement: true,
  AssignmentPattern: true,
  SpreadElement: true,

  Literal: true,
  TemplateLiteral: true,
  TemplateElement: true,
  ArrayExpression: true,
  ObjectExpression: true,

  UnaryExpression({ operator }) {
    if (operator === 'delete') {
      return 'No side-effects: cannot use \'delete\'';
    }
  },
  BinaryExpression: true,
  LogicalExpression: true,
  ConditionalExpression: true,

  // Blacklist which function can be called
  CallExpression({ callee: { type, property, name }, arguments: args }) {
    const usesIdentifier = type === 'Identifier';
    const usesMemberExpression = type === 'MemberExpression' &&
      property.type === 'Identifier';
    if (!usesIdentifier && !usesMemberExpression) {
      return 'Function calls must be like: \'func()\' or \'obj.func()\'';
    }
    const funcName = usesMemberExpression ? property.name : name;
    if (functionFuncNames.includes(funcName)) {
      return `Cannot call '${funcName}()'`;
    }
    if (sideEffectsFuncNames.includes(funcName)) {
      return `No side-effects: cannot call '${funcName}()'`;
    }
    if (globalFuncNames.includes(funcName)) {
      return `No access to global state: cannot call '${funcName}()'`;
    }
    if (asyncFuncNames.includes(funcName)) {
      return `Must be synchronous: cannot call '${funcName}()'`;
    }
    const isWrongAssign = funcName === 'assign' &&
      (!args[0] || args[0].type !== 'ObjectExpression');
    if (isWrongAssign) {
      return 'No side-effects: \'Object.assign()\' first argument must be a literal object';
    }
  },
  // Whitelist which constructor can be called
  NewExpression({ callee: { type, name } }) {
    const usesIdentifier = type === 'Identifier';
    if (!usesIdentifier) {
      return 'Constructor calls must be like: \'new Type()\'';
    }
    if (!allowedConstructors.includes(name)) {
      return `Cannot call 'new ${name}()'`;
    }
  },

  ScopeExpression: true,
  ScopeBody: true,

  // TODO: remove when https://github.com/ternjs/acorn/pull/558 is fixed
  VariablePattern: true,
  MemberPattern: true,
}));

// We do not want things like eval() which could circumvent our restrictions
const functionFuncNames = ['eval', 'Function', 'bind', 'call', 'apply'];

// Those methods create side-effects, e.g. assignments
const sideEffectsFuncNames = [
  'defineProperty',
  'defineProperties',
  'preventExtensions',
  'seal',
  'freeze',
  'setPrototypeOf',
  'splice',
  'fill',
  'copyWithin',
  'push',
  'pop',
  'unshift',
  'shift',
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'setYear',
];

// Those methods access global state
const globalFuncNames = ['for', 'keyFor'];

// Those methods imply async code
const asyncFuncNames = ['then', 'catch'];

// Those are the only constructors that can be called with `new`
const allowedConstructors = ['Date', 'Array', 'RegExp'];


module.exports = {
  system: {
    getRules,
  },
  startup: {
    getRules,
  },
};
