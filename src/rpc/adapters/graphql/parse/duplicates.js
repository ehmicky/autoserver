import { findDuplicate } from '../../../../utils/functional/uniq.js'
import { throwError } from '../../../../errors/main.js'

// GraphQL spec includes many requirements of checking for duplicates
export const validateDuplicates = function ({ nodes, type }) {
  const names = nodes.map(({ name }) => name && name.value)
  const nameA = findDuplicate(names)

  if (nameA === undefined) {
    return
  }

  const message = `Two ${type} are named '${nameA}'`
  throwError(message, { reason: 'VALIDATION' })
}
