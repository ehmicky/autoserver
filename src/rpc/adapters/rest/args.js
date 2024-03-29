import { throwError } from '../../../errors/main.js'
import { throwPb } from '../../../errors/props.js'
import { mapValues } from '../../../utils/functional/map.js'

// Use query variables, request payload and URL /ID to retrieve `args`
export const getArgs = ({ method, payload, queryvars, id }) => {
  const args = mapValues(queryvars, addDefaultTrue)
  const argsA = addData({ args, payload })
  const argsB = addId({ method, args: argsA, id })
  return argsB
}

// Omitting a query variable's value defaults to `true`
// Except for arguments which can be an empty strings, like pagination cursors
const addDefaultTrue = (value, name) => {
  if (value !== '') {
    return value
  }

  if (NO_DEFAULT_NAMES.has(name)) {
    return value
  }

  return true
}

const NO_DEFAULT_NAMES = new Set(['before', 'after'])

// Use request payload for `args.data`
const addData = ({ args, payload }) => {
  if (payload === undefined) {
    return args
  }

  validatePayload({ payload })

  return { ...args, data: payload }
}

const validatePayload = ({ payload }) => {
  if (payload && typeof payload === 'object') {
    return
  }

  const message = 'Invalid request payload: it must be an object or an array'
  throwPb({ reason: 'REQUEST_NEGOTIATION', message, extra: { kind: 'type' } })
}

// Use ID in URL /rest/COLLECTION/ID for `args.id`
const addId = ({ method, args, args: { data }, id }) => {
  if (id === undefined) {
    return args
  }

  // If it looks like a number, it will have been transtyped by query variables
  // middleware
  const idA = String(id)

  // If the method does not use `args.id`, it is still checked against
  // `args.data`
  if (NO_ID_METHODS.has(method)) {
    validateId({ data, id: idA })
    return args
  }

  return { ...args, id: idA }
}

const NO_ID_METHODS = new Set(['POST', 'PUT'])

const validateId = ({ data, id }) => {
  if (Array.isArray(data)) {
    const message = 'Payload must be a single object'
    throwError(message, { reason: 'VALIDATION' })
  }

  if (data.id !== id) {
    const message = `The model's 'id' is '${data.id}' in the request payload but is '${id}' in the URL`
    throwError(message, { reason: 'VALIDATION' })
  }
}
