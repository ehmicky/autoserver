import { throwError } from '../errors/main.js'

import { parseRef } from './ref_parsing.js'
import { postValidate } from './validate/main.js'

// Replaces model.ATTR in simple patch operations (i.e. with no operators)
export const replaceSimpleRef = ({ ref, attributes, datum, commandpath }) => {
  if (attributes[ref] !== undefined) {
    return datum[ref]
  }

  const message = `At '${commandpath.join('.')}': attribute '${ref}' is unknown`
  throwError(message, { reason: 'VALIDATION' })
}

// Replaces model.ATTR when patch operation is applied
export const replaceRef = ({ opVal, datum, ...rest }) => {
  const ref = parseRef(opVal)

  if (ref === undefined) {
    return opVal
  }

  const opValA = datum[ref]

  postValidate({ opVal: opValA, ...rest })

  return opValA
}
