import { addErrorHandler } from './handler.js'
import { getStandardError } from './standard.js'

// Every instruction should throw standard errors
export const wrapInstruction = function(instructionName, instruction) {
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
