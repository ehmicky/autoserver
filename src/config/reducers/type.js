import { mapAttrs } from '../helpers.js'

// From `type: string[]` or `type: my_coll`
// to `type: string, isArray: true` or `target: my_coll, isArray: false`
const mapAttr = function ({ attr }) {
  const [, rawType, brackets] = TYPE_REGEXP.exec(attr.type)
  const isArray = brackets !== undefined
  const isColl = !NON_COLL_TYPES.includes(rawType)

  if (isColl) {
    return { type: undefined, target: rawType, isArray }
  }

  return { type: rawType, isArray }
}

// Parse 'type[]' to ['type', '[]'] and 'type' to ['type', '']
const TYPE_REGEXP = /([^[]*)(\[\])?$/u

const NON_COLL_TYPES = [
  'array',
  'object',
  'string',
  'number',
  'integer',
  'null',
  'boolean',
]

export const normalizeType = mapAttrs.bind(null, mapAttr)
