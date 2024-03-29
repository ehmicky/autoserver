import { addGenErrorHandler } from '../../../../../errors/handler.js'
import { throwError } from '../../../../../errors/main.js'
import { validateDuplicates } from '../duplicates.js'

// Apply GraphQL directives @include and @skip
export const applyDirectives = ({
  selection: { directives = [] },
  variables,
}) => {
  // GraphQL spec 5.6.3 'Directives Are Unique Per Location'
  validateDuplicates({ nodes: directives, type: 'directives' })

  return directives.every((directive) =>
    applyDirective({ directive, variables }),
  )
}

const applyDirective = ({
  directive: {
    arguments: args,
    name: { value: directiveName },
  },
  variables,
}) => {
  if (directiveName === 'include') {
    return eCheckDirective({ variables, args, directiveName })
  }

  if (directiveName === 'skip') {
    return !eCheckDirective({ variables, args, directiveName })
  }

  const message = `Unknown directive: '${directiveName}'`
  throwError(message, { reason: 'VALIDATION' })
}

const checkDirective = ({ variables, args }) => {
  if (args.length !== 1) {
    const message = 'Incorrect number of arguments'
    throwError(message, { reason: 'VALIDATION' })
  }

  const [
    {
      name: { value: ifArgName } = {},
      value: {
        kind: ifKind,
        value: ifValue,
        name: { value: ifValueName } = {},
      },
    },
  ] = args

  if (ifArgName !== 'if') {
    const message = 'Invalid argument'
    throwError(message, { reason: 'VALIDATION' })
  }

  return checkSpecificDirective({ ifKind, ifValue, variables, ifValueName })
}

const checkSpecificDirective = ({
  ifKind,
  ifValue,
  variables,
  ifValueName,
}) => {
  const directivesChecker = directivesCheckers[ifKind]

  if (!directivesChecker) {
    const message = 'Argument must be a variable or a boolean value.'
    throwError(message, { reason: 'VALIDATION' })
  }

  return directivesChecker({ ifValue, variables, ifValueName })
}

const eCheckDirective = addGenErrorHandler(checkDirective, {
  message: ({ directiveName }) => `Error parsing directive '${directiveName}'`,
  reason: 'VALIDATION',
})

const checkBooleanDirective = ({ ifValue }) => ifValue

const checkVariableDirective = ({ variables, ifValueName }) => {
  const evaledValue = variables[ifValueName]

  if (typeof evaledValue !== 'boolean') {
    const message = 'Invalid variable'
    throwError(message, { reason: 'VALIDATION' })
  }

  return evaledValue
}

const directivesCheckers = {
  BooleanValue: checkBooleanDirective,
  Variable: checkVariableDirective,
}
