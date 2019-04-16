const { decapitalize } = require('underscore.string')

const { runConfigFunc } = require('../../functions/run.js')
const { addErrorHandler } = require('../../errors/handler.js')
const { createPb } = require('../../errors/props.js')
const { getPatchErrorProps } = require('../error')

// Uses `patchOp.check()`
const applyCheck = function({
  opVal,
  type,
  operator: { check },
  attr: { type: attrType },
  mInput,
}) {
  if (check === undefined) {
    return
  }

  // Normalize `null` to `undefined`
  const opValA = opVal === null ? undefined : opVal

  const params = { arg: opValA, type: attrType }
  const message = eRunConfigFunc({ configFunc: check, mInput, params, type })

  const messageA = getCheckMessage({ type, message })
  return messageA
}

const applyCheckHandler = function(error) {
  return error
}

const eRunConfigFunc = addErrorHandler(runConfigFunc, applyCheckHandler)

const getCheckMessage = function({ type, message }) {
  if (message === undefined) {
    return
  }

  if (typeof message === 'string') {
    return decapitalize(message)
  }

  if (message instanceof Error) {
    return createPb(
      `patch operator '${type}' check() function must return either a string or undefined. Instead it threw or returned an error.`,
      { ...getPatchErrorProps({ type }), innererror: message },
    )
  }

  return createPb(
    `patch operator '${type}' check() function must return either a string or undefined, not '${message}'`,
    getPatchErrorProps({ type, extra: { value: message } }),
  )
}

module.exports = {
  applyCheck,
}
