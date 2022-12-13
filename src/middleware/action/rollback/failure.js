import { isError } from '../../../errors/main.js'

// Rethrow original error
export const rethrowFailure = ({ failedActions: [error], results }) => {
  const errorA = addRollbackFailures({ error, results })

  throw errorA
}

// If rollback itself fails, give up and add rollback error to error response,
// as `error.rollback_failures`
const addRollbackFailures = ({ error, results }) => {
  const rollbackFailures = results.filter((result) =>
    isError({ error: result }),
  )

  if (rollbackFailures.length === 0) {
    return error
  }

  const rollbackFailuresA = rollbackFailures
    .map(({ message }) => message)
    .join('\n')

  error.extra.rollback_failures = rollbackFailuresA
  return error
}
