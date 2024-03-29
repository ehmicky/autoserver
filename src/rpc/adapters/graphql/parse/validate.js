import { throwError } from '../../../../errors/main.js'
import { getWordsList } from '../../../../utils/string.js'

// Validate GraphQL main definition
export const validateMainDef = ({ mainDef, operationName, method }) => {
  validateDef({ mainDef, operationName })
  validateMainSelection({ mainDef })
  validateQuery({ mainDef })
  validateMutation({ mainDef, method })
}

const validateDef = ({ mainDef, operationName }) => {
  if (mainDef) {
    return
  }

  if (operationName) {
    const message = `Could not find GraphQL operation '${operationName}'`
    throwError(message, { reason: 'VALIDATION' })
  }

  const msg = 'Missing GraphQL query'
  throwError(msg, { reason: 'VALIDATION' })
}

const validateMainSelection = ({
  mainDef: {
    selectionSet: { selections },
  },
}) => {
  if (selections.length > 1) {
    const names = getOperationNames({ selections })
    const message = `Cannot perform several GraphQL operations at once: ${names}`
    throwError(message, { reason: 'VALIDATION' })
  }

  const [{ kind }] = selections

  if (kind !== 'Field') {
    const message = 'Cannot use a GraphQL fragment as the main operation'
    throwError(message, { reason: 'VALIDATION' })
  }
}

const getOperationNames = ({ selections }) => {
  const operationNames = selections.map(({ name: { value } = {} }) => value)
  return getWordsList(operationNames, { op: 'and', quotes: true })
}

// GraphQL queries must use (e.g. in HTTP) GET, but mutations have no
// restrictions
const validateQuery = ({
  mainDef: {
    selectionSet: {
      selections: [{ name }],
    },
    operation,
  },
}) => {
  if (operation !== 'query') {
    return
  }

  if (!isFindQuery({ name })) {
    const message = "Can only perform 'find' commands with a GraphQL 'query'"
    throwError(message, { reason: 'VALIDATION' })
  }
}

const validateMutation = ({
  mainDef: {
    selectionSet: {
      selections: [{ name }],
    },
    operation,
  },
  method,
}) => {
  if (operation !== 'mutation') {
    return
  }

  if (method === 'GET') {
    const message =
      "Can only perform GraphQL queries, not mutations, with the protocol method 'GET'"
    throwError(message, { reason: 'VALIDATION' })
  }

  if (isFindQuery({ name })) {
    const message = "Cannot perform 'find' commands with a GraphQL 'mutation'"
    throwError(message, { reason: 'VALIDATION' })
  }
}

const isFindQuery = ({ name }) =>
  name.value.startsWith('find') || name.value === '__schema'
