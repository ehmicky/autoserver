import { Buffer } from 'buffer'

import { isType } from '../../../content_types.js'

// Transform content to a buffer
export const serializeContent = function({
  format,
  content,
  type,
  topargs,
  error,
}) {
  const contentA = stringifyContent({ format, content, type })

  const contentB = applySilent({ content: contentA, topargs, error })

  const contentC = Buffer.from(contentB)

  return contentC
}

const stringifyContent = function({ format, content, type }) {
  if (!isType(type, 'object')) {
    return content
  }

  const contentA = format.serializeContent(content)
  return contentA
}

// When `args.silent` is used (unless this is an error response).
const applySilent = function({ content, topargs: { silent } = {}, error }) {
  if (silent && error === undefined) {
    return ''
  }

  return content
}
