'use strict';

const { isObjectType } = require('../utilities');

const REF_SYM = Symbol('ref');

// Remember original JSON reference absolute path so it can be used later,
// for example to serialize back
const setRef = function ({ content, path }) {
  if (!isObjectType(content)) { return content; }

  const contentA = { ...content, [REF_SYM]: path };
  return contentA;
};

const getRef = function (content) {
  return content[REF_SYM];
};

module.exports = {
  setRef,
  getRef,
};
