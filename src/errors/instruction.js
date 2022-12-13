import { addErrorHandler } from './handler.js'
import { getStandardError } from './standard.js'

// Every instruction should throw standard errors
export const wrapInstruction = (instructionName, instruction) =>
  addErrorHandler(
    instruction,
    instructionHandler.bind(undefined, instructionName),
  )

const instructionHandler = (instructionName, error) => {
  const {
    description = `Could not perform instruction '${instructionName}'.`,
    ...errorA
  } = getStandardError({ error })

  const errorB = { ...errorA, description }
  throw errorB
}
