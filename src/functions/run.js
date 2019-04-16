const { addGenPbHandler } = require('../errors/handler.js')

const { getParams } = require('./params/values.js')
const { stringifyConfigFunc } = require('./tokenize')

// Process config function, i.e. fires it and returns its value
const eRunConfigFunc = function({
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

const runConfigFunc = addGenPbHandler(eRunConfigFunc, {
  message: ({ configFunc }) =>
    `Function failed: '${stringifyConfigFunc({ configFunc })}'`,
  reason: 'CONFIG_RUNTIME',
  extra: ({ configFunc }) => ({ value: stringifyConfigFunc({ configFunc }) }),
})

module.exports = {
  runConfigFunc,
}
