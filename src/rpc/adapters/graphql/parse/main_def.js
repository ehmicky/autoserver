import { throwError } from '../../../../errors/main.js'

import { validateDuplicates } from './duplicates.js'

// Retrieve GraphQL main definition
// Takes into account GraphQL's `operationName`
export const getMainDef = ({
  queryDocument: { definitions },
  operationName,
}) => {
  const defs = definitions.filter(({ kind }) => kind === 'OperationDefinition')

  // GraphQL spec 5.1.1.1 'Operation Name Uniqueness'
  validateDuplicates({ nodes: defs, type: 'operations' })

  validateAnonymousNames(defs)

  return defs.find(
    ({ name }) => !operationName || (name && name.value) === operationName,
  )
}

// GraphQL spec 5.1.2.1 'Lone Anonymous Operation'
const validateAnonymousNames = (defs) => {
  const hasAnonymousOperation = defs.some(({ name }) => name === null)

  if (hasAnonymousOperation && defs.length > 1) {
    const message =
      'All operations must have names, if there are several of them'
    throwError(message, { reason: 'VALIDATION' })
  }
}
