'use strict';

const { flatten } = require('./flatten');

// Take a dot-notation path that can contain `*` and expand it to all
// possible paths within `obj`
// For example, `{a: [{attrB: 'b', attrC: 'c', attrD: 'd'}]}` + `a.*.*` would
// result in `a.0.attrB`, `a.0.attrC` and `a.0.attrD`
const expandPath = function (obj, key) {
  const keys = key.split('.');
  const keysA = getPaths(obj, keys);
  return keysA;
};

const getPaths = function (obj, path, parentPath = []) {
  // Final values
  if (path.length === 0) {
    return parentPath.join('.');
  }

  // If the parent path has some non-existing values
  if (!isStructuredType(obj)) { return []; }

  const [childKey, ...pathA] = path;

  if (childKey !== '*') {
    return getPaths(obj[childKey], pathA, [...parentPath, childKey]);
  }

  const paths = Object.entries(obj).map(([childKeyA, child]) =>
    getPaths(child, pathA, [...parentPath, childKeyA]));
  const pathsA = flatten(paths);
  return pathsA;
};

const isStructuredType = function (obj) {
  return obj && typeof obj === 'object';
};

module.exports = {
  expandPath,
};
