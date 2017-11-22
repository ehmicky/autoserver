'use strict';

const { groupBy, flatten } = require('../utilities');

const {
  PARENT_OPERATORS,
  ATTR_PARENT_OPERATORS,
  ATTR_ANCESTOR_OPERATORS,
} = require('./operators');

// Call `func(node)` recursively over each node of `args.filter`
// Returns array of func() return values
const crawlNodes = function (node, func) {
  const children = getNodeChildren(node);
  const childrenA = children.map(child => crawlNodes(child, func));
  const childrenB = flatten(childrenA);

  const returnValue = func(node);

  if (returnValue === undefined) { return childrenB; }

  return [returnValue, ...childrenB];
};

const getNodeChildren = function ({ type, value }) {
  if (!PARENT_OPERATORS.includes(type)) { return []; }

  return value;
};

// Call `func(node)` recursively over each attribute of `args.filter`
// Returns array of func() return values
const crawlAttrs = function (node, func) {
  const { type, value } = node;

  if (!ATTR_ANCESTOR_OPERATORS.includes(type)) {
    const returnValue = getAttrs(node, func);
    return [...returnValue, value];
  }

  const children = value.map(child => crawlAttrs(child, func));
  const childrenA = flatten(children);
  return childrenA;
};

const getAttrs = function (node, func) {
  const { type, value } = node;

  if (!ATTR_PARENT_OPERATORS.includes(type)) {
    return func([node]) || [];
  }

  const groups = groupBy(value, 'attrName');
  const attrs = Object.entries(groups)
    .map(([attrName, group]) => func(group, attrName));
  return attrs;
};

// Call `func(node)` recursively over each node of `args.filter`
// Returns node recursively mapped
const mapNodes = function (node, func) {
  const value = mapChildren(node, func);
  const nodeA = { ...node, value };

  const nodeB = func(nodeA);
  return nodeB;
};

const mapChildren = function ({ type, value }, func) {
  if (!PARENT_OPERATORS.includes(type)) { return value; }

  return value.map(child => mapNodes(child, func));
};

module.exports = {
  crawlNodes,
  crawlAttrs,
  mapNodes,
};
