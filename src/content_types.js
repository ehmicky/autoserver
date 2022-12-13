import { isObject } from './utils/functional/type.js'

export const CONTENT_TYPES = {
  model: {
    validate: (content) => isJsonObject(content),
    types: new Set(['model', 'object']),
  },

  models: {
    validate: (content) => isJsonArray(content) && content.every(isJsonObject),
    types: new Set(['model', 'object']),
  },

  error: {
    validate: (content) => isJsonObject(content),
    types: new Set(['model', 'object', 'error']),
  },

  object: {
    validate: (content) => isJsonObject(content),
    types: new Set(['object']),
  },

  html: {
    validate: (content) => typeof content === 'string',
    types: new Set([]),
  },

  text: {
    validate: (content) => typeof content === 'string',
    types: new Set([]),
  },
}

const isJsonObject = (value) => isObject(value) && isJson(value)

const isJsonArray = (value) => Array.isArray(value) && isJson(value)

const isJson = (val) => {
  try {
    JSON.stringify(val)
  } catch {
    return false
  }

  return true
}

export const isType = (contentType, type) =>
  CONTENT_TYPES[contentType] !== undefined &&
  CONTENT_TYPES[contentType].types.has(type)
