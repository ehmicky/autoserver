'use strict'

const { mapValues } = require('../utils')
const { addErrorHandler, getStandardError } = require('../errors')

// Every instruction should throw standard errors
const addErrorHandlers = function({ instructions }) {
  return mapValues(instructions, (instruction, instructionName) =>
    addErrorHandler(
      instruction,
      instructionHandler.bind(null, instructionName),
    ),
  )
}

const instructionHandler = function(instructionName, error) {
  const {
    description = `Could not perform instruction '${instructionName}'.`,
    ...errorA
  } = getStandardError({ error })

  const errorB = { ...errorA, description }
  throw errorB
}

module.exports = {
  addErrorHandlers,
}
