import { CONTENT_TYPES } from '../../content_types.js'
import { throwPb } from '../../errors/props.js'

// Action layer output validation
// Those errors should not happen, i.e. server-side (e.g. 500)
export const actionValidationOut = ({ response: { content, type } }) => {
  validateType({ type })
  validateContent({ content, type })
}

const validateType = ({ type }) => {
  if (typeof type !== 'string') {
    const message = `'type' must be a string, not '${type}'`
    throwPb({ message, reason: 'ENGINE' })
  }

  const isWrongType = CONTENT_TYPES[type] === undefined

  if (isWrongType) {
    const message = `Invalid 'type': '${type}'`
    throwPb({ message, reason: 'ENGINE' })
  }
}

const validateContent = ({ content, type }) => {
  const isRightContent = CONTENT_TYPES[type].validate(content)

  if (isRightContent) {
    return
  }

  const message = `Invalid 'content' of type '${type}': '${content}'`
  throwPb({ message, reason: 'ENGINE' })
}
