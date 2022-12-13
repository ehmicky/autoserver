import { throwError } from '../../errors/main.js'
import { fullRecurseMap } from '../../utils/functional/map.js'
import { isObject } from '../../utils/functional/type.js'

// Validate JSON schema `$data` properties
export const validateJsonSchemaData = ({ config }) => {
  fullRecurseMap(config, validateDataMapper)
}

const validateDataMapper = (obj) => {
  if (!isObject(obj)) {
    return
  }

  Object.values(obj).forEach((child) => {
    if (!child || !child.$data) {
      return
    }

    validateDataFormat(child)
  })
}

// Validates that $data is { $data: '...' }
const validateDataFormat = (obj) => {
  if (typeof obj.$data !== 'string') {
    const message = `'$data' must be a string: ${obj.$data}`
    throwError(message, { reason: 'CONFIG_VALIDATION' })
  }

  if (Object.keys(obj).length > 1) {
    const val = JSON.stringify(obj)
    const message = `'$data' must be the only property when specified: '${val}'`
    throwError(message, { reason: 'CONFIG_VALIDATION' })
  }
}
