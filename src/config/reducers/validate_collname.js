import pluralize from 'pluralize'

import { throwError } from '../../errors/main.js'
import { isObject } from '../../utils/functional/type.js'

// Validate collections are properly named
export const validateClientCollnames = ({ config: { collections } }) => {
  if (!isObject(collections)) {
    return
  }

  Object.values(collections).forEach(checkCollnames)
}

const checkCollnames = ({ name }) => {
  name.forEach((nameA) => {
    checkCollname({ name: nameA })
  })
}

const checkCollname = ({ name }) => {
  const pluralname = pluralize.plural(name)

  // Collection name must be plural
  // The reason is to avoid having to handle different cases where the
  // collection name is sometimes singular, sometimes plural.
  // This is also easier for the user to remember.
  if (name === pluralname) {
    return
  }

  const message = `Collection's name '${name}' must be in plural form, i.e. should be '${pluralname}'`
  throwError(message, { reason: 'CONFIG_VALIDATION' })
}
