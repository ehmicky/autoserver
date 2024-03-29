import { throwPb } from '../../../errors/props.js'

import { TYPES } from './types.js'

export const validateResponse = ({ response: { type, content } }) => {
  if (!type) {
    const message = 'Server sent an response with no content type'
    throwPb({ message, reason: 'ENGINE' })
  }

  if (content === undefined) {
    const message = 'Server sent an empty response'
    throwPb({ message, reason: 'ENGINE' })
  }

  if (TYPES[type] === undefined) {
    const message = 'Server tried to respond with an unsupported content type'
    throwPb({ message, reason: 'ENGINE' })
  }
}
