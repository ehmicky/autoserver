const { runConfigFunc } = require('../../../functions/run.js')

// Report log
const report = function({ opts: { report: configFunc }, configFuncInput }) {
  return runConfigFunc({ configFunc, ...configFuncInput })
}

module.exports = {
  report,
}
