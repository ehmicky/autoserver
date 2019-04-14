'use strict'

const { addErrorHandler } = require('./handler.js')
const { getStandardError } = require('./standard.js')

// Every instruction should throw standard errors
const wrapInstruction = function(instructionName, instruction) {
  return addErrorHandler(
    instruction,
    instructionHandler.bind(null, instructionName),
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
  wrapInstruction,
}
