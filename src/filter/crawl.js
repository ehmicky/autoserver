'use strict';

const { assignArray } = require('../utilities');

// Call `func(node)` recursively over each node of `args.filter`
// Returns array of func() return values
const crawlNodes = function (node, func) {
  const returnValue = func(node);

  const children = getChildren(node)
    .map(child => crawlNodes(child, func))
    .reduce(assignArray, []);

  if (returnValue === undefined) { return children; }

  return [returnValue, ...children];
};

// Call `func(node)` recursively over each node of `args.filter`
// Returns node recursively mapped
const mapNodes = function (node, func) {
  const nodeA = func(node);

  const children = getChildren(nodeA);
  if (children === undefined) { return nodeA; }

  const value = children
    .map(child => mapNodes(child, func))
    .reduce(assignArray, []);
  return { ...nodeA, value };
};

const getChildren = function ({ type, value }) {
  if (!PARENT_TYPES.includes(type)) { return []; }

  return value;
};

const PARENT_TYPES = ['all', 'some', 'or', 'and'];

module.exports = {
  crawlNodes,
  mapNodes,
};
