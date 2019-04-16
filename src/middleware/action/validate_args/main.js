import { addGenErrorHandler } from '../../../errors/handler.js'
import { compile } from '../../../validation/compile.js'
import { validate } from '../../../validation/validate.js'
import { getLimits } from '../../../limits.js'

import { SCHEMA } from './args_schema.js'
import { COMMANDS } from './commands.js'

// Check arguments for client-side syntax errors.
const validateArgs = function({ top: { args, command }, config }) {
  const data = getData({ args, command, config })

  eValidate({ compiledJsonSchema, data })
}

const compiledJsonSchema = compile({ jsonSchema: SCHEMA })

const getData = function({ args, command, config }) {
  const dynamicVars = getDynamicArgs({ command, config })
  return { arguments: args, dynamicVars }
}

const getDynamicArgs = function({ command, command: { multiple }, config }) {
  const { required, optional } = COMMANDS[command.name]
  const validArgs = [...required, ...optional]
  const { pagesize } = getLimits({ config })

  return { multiple, requiredArgs: required, validArgs, pagesize }
}

const getMessage = function(input, { message }) {
  const messageA = message.replace(ARGUMENTS_REGEXP, "'$1'")
  return `Wrong arguments: ${messageA}`
}

// Matches 'arguments.ARG'
const ARGUMENTS_REGEXP = /^arguments.([^ ]+)/u

const eValidate = addGenErrorHandler(validate, {
  reason: 'VALIDATION',
  message: getMessage,
})

module.exports = {
  validateArgs,
}
