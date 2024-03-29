import underscoreString from 'underscore.string'

import { addErrorHandler } from '../../errors/handler.js'
import { createPb } from '../../errors/props.js'
import { runConfigFunc } from '../../functions/run.js'
import { getPatchErrorProps } from '../error.js'

// Uses `patchOp.check()`
export const applyCheck = ({
  opVal,
  type,
  operator: { check },
  attr: { type: attrType },
  mInput,
}) => {
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

const applyCheckHandler = (error) => error

const eRunConfigFunc = addErrorHandler(runConfigFunc, applyCheckHandler)

const getCheckMessage = ({ type, message }) => {
  if (message === undefined) {
    return
  }

  if (typeof message === 'string') {
    return underscoreString.decapitalize(message)
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
