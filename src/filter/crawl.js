'use strict';

const { assignArray } = require('../utilities');

// Call `func(node)` recursively over each node of `args.filter`
// Returns array of func() return values
const crawlFilter = function (node, func) {
  const returnValue = func(node);

  const children = getChildren(node) || [];
  const childrenA = children
    .map(child => crawlFilter(child, func))
    .reduce(assignArray, []);

  return returnValue === undefined
    ? childrenA
    : [returnValue, ...childrenA];
};

// Call `func(node)` recursively over each node of `args.filter`
// Returns node recursively mapped
const mapFilter = function (node, func) {
  const nodeA = func(node);

  const children = getChildren(nodeA);
  if (children === undefined) { return nodeA; }

  const value = children
    .map(child => mapFilter(child, func))
    .reduce(assignArray, []);
  return { ...nodeA, value };
};

const getChildren = function ({ type, value }) {
  if (!PARENT_TYPES.includes(type)) { return; }

  return value;
};

const PARENT_TYPES = ['all', 'some', 'or', 'and'];

module.exports = {
  crawlFilter,
  mapFilter,
};
