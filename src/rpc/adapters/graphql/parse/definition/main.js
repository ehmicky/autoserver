import { throwError } from '../../../../../errors/main.js'

import { parseArgs } from './args.js'
import { applyDirectives } from './directive.js'
import { addPopulate } from './populate.js'
import { parseSelects } from './select.js'

// Transform GraphQL AST into rpc-agnostic `rpcDef`
export const parseRpcDef = ({ mainDef, variables, fragments }) => {
  const mainSelection = getMainSelection({ mainDef, variables })

  const {
    name: { value: commandName },
  } = mainSelection
  const argsA = getArgs({ mainSelection, variables, fragments, commandName })

  return { commandName, args: argsA }
}

const getMainSelection = ({
  mainDef: {
    selectionSet: { selections },
  },
  variables,
}) => {
  const mainSelection = selections.find((selection) =>
    applyDirectives({ selection, variables }),
  )
  return mainSelection
}

const getArgs = ({
  mainSelection,
  mainSelection: { selectionSet },
  variables,
  fragments,
  commandName,
}) => {
  const args = parseArgs({ mainSelection, variables })

  FORBIDDEN_ARGS.forEach((argName) => {
    validateForbiddenArg({ args, argName })
  })

  const argsA = parseSelects({ args, selectionSet, variables, fragments })
  const argsB = addPopulate({ args: argsA, commandName })

  return argsB
}

const FORBIDDEN_ARGS = ['select', 'populate']

const validateForbiddenArg = ({ args, argName }) => {
  if (args[argName] === undefined) {
    return
  }

  const message = `Cannot specify '${argName}' argument with GraphQL`
  throwError(message, { reason: 'VALIDATION' })
}
