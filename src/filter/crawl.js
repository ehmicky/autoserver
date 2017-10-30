'use strict';

const { assignArray, groupBy } = require('../utilities');

// Call `func(node)` recursively over each node of `args.filter`
// Returns array of func() return values
const crawlNodes = function (node, func) {
  const children = getNodeChildren(node)
    .map(child => crawlNodes(child, func))
    .reduce(assignArray, []);

  const returnValue = func(node);

  if (returnValue === undefined) { return children; }

  return [returnValue, ...children];
};

// Call `func(node)` recursively over each node of `args.filter`
// Returns node recursively mapped
const mapNodes = function (node, func) {
  const nodeA = func(node);

  const children = getNodeChildren(nodeA);
  if (children === undefined) { return nodeA; }

  const value = children
    .map(child => mapNodes(child, func))
    .reduce(assignArray, []);
  return { ...nodeA, value };
};

const getNodeChildren = function ({ type, value }) {
  if (!NODE_PARENT_TYPES.includes(type)) { return []; }

  return value;
};

const NODE_PARENT_TYPES = ['all', 'some', 'or', 'and'];

// Call `func(node)` recursively over each attribute of `args.filter`
// Returns array of func() return values
const crawlAttrs = function (node, func) {
  const children = getAttrChildren(node);

  if (children.length > 0) {
    return children
      .map(child => crawlAttrs(child, func))
      .reduce(assignArray, []);
  }

  const returnValue = getAttrs(node, func);

  return [...returnValue, ...children];
};

const getAttrs = function (node, func) {
  const { type, value } = node;

  if (!ATTR_PARENT_TYPES.includes(type)) {
    return func([node]) || [];
  }

  const groups = groupBy(value, 'attrName');

  return Object.entries(groups)
    .map(([attrName, group]) => func(group, attrName));
};

const getAttrChildren = function ({ type, value }) {
  if (!ATTR_RECURSIVE_TYPES.includes(type)) { return []; }

  return value;
};

const ATTR_RECURSIVE_TYPES = ['or'];
const ATTR_PARENT_TYPES = ['and'];

module.exports = {
  crawlNodes,
  crawlAttrs,
  mapNodes,
};
