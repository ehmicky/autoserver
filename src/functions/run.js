'use strict'

const { addGenPbHandler } = require('../errors')

const { getParams } = require('./params')
const { stringifyConfigFunc } = require('./tokenize')

// Process config function, i.e. fires it and returns its value
const runConfigFunc = function({
  configFunc,
  mInput,
  mInput: { serverParams },
  params,
}) {
  // If this is not config function, returns as is
  if (typeof configFunc !== 'function') {
    return configFunc
  }

  const paramsA = getParams(mInput, { params, serverParams, mutable: false })

  return configFunc(paramsA)
}

const eRunConfigFunc = addGenPbHandler(runConfigFunc, {
  message: ({ configFunc }) =>
    `Function failed: '${stringifyConfigFunc({ configFunc })}'`,
  reason: 'CONFIG_RUNTIME',
  extra: ({ configFunc }) => ({ value: stringifyConfigFunc({ configFunc }) }),
})

module.exports = {
  runConfigFunc: eRunConfigFunc,
}
