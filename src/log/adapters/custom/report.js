'use strict';

const { runConfigFunc } = require('../../../functions');

// Report log
const report = function ({ opts: { report: configFunc }, configFuncInput }) {
  return runConfigFunc({ configFunc, ...configFuncInput });
};

module.exports = {
  report,
};
