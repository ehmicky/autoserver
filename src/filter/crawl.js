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

const getNodeChildren = function ({ type, value }) {
  if (!NODE_PARENT_TYPES.includes(type)) { return []; }

  return value;
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
  if (!NODE_PARENT_TYPES.includes(type)) { return value; }

  return value.map(child => mapNodes(child, func));
};

const NODE_PARENT_TYPES = ['_all', '_some', '_or', '_and'];

// Call `func(node)` recursively over each attribute of `args.filter`
// Returns array of func() return values
const crawlAttrs = function (node, func) {
  const children = getAttrChildren(node);

  if (children.length !== 0) {
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

const ATTR_RECURSIVE_TYPES = ['_or'];
const ATTR_PARENT_TYPES = ['_and'];

module.exports = {
  crawlNodes,
  crawlAttrs,
  mapNodes,
};
