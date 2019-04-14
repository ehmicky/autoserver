'use strict'

const { isObject } = require('./utils/functional/type.js')

const CONTENT_TYPES = {
  model: {
    validate: content => isJsonObject(content),
    types: ['model', 'object'],
  },

  models: {
    validate: content => isJsonArray(content) && content.every(isJsonObject),
    types: ['model', 'object'],
  },

  error: {
    validate: content => isJsonObject(content),
    types: ['model', 'object', 'error'],
  },

  object: {
    validate: content => isJsonObject(content),
    types: ['object'],
  },

  html: {
    validate: content => typeof content === 'string',
    types: [],
  },

  text: {
    validate: content => typeof content === 'string',
    types: [],
  },
}

const isJsonObject = function(value) {
  return isObject(value) && isJson(value)
}

const isJsonArray = function(value) {
  return Array.isArray(value) && isJson(value)
}

const isJson = function(val) {
  try {
    JSON.stringify(val)
  } catch {
    return false
  }

  return true
}

const isType = function(contentType, type) {
  return (
    CONTENT_TYPES[contentType] !== undefined &&
    CONTENT_TYPES[contentType].types.includes(type)
  )
}

module.exports = {
  CONTENT_TYPES,
  isType,
}
