import { Buffer } from 'buffer'

import { isType } from '../../../content_types.js'

// Transform content to a buffer
export const serializeContent = async function ({
  format,
  content,
  type,
  topargs,
  error,
}) {
  const contentA = await stringifyContent({ format, content, type })

  const contentB = applySilent({ content: contentA, topargs, error })

  const contentC = Buffer.from(contentB)

  return contentC
}

const stringifyContent = async function ({ format, content, type }) {
  return isType(type, 'object')
    ? await format.serializeContent(content)
    : content
}

// When `args.silent` is used (unless this is an error response).
const applySilent = function ({ content, topargs: { silent } = {}, error }) {
  if (silent && error === undefined) {
    return ''
  }

  return content
}
