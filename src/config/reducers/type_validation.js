import { mapAttrs } from '../helpers.js'

// Add JSON schema validation based on `type`
const mapAttr = function ({ attr, attr: { type, isArray } }) {
  if (!type) {
    return
  }

  if (!isArray) {
    return addSingleValidation(attr)
  }

  return addMultipleValidation(attr)
}

const addSingleValidation = function ({ type, validate }) {
  return { validate: { ...validate, type } }
}

const addMultipleValidation = function ({
  type,
  validate,
  validate: { items = {} },
}) {
  return {
    validate: {
      ...validate,
      type: 'array',
      items: { ...items, type },
    },
  }
}

export const addTypeValidation = mapAttrs.bind(null, mapAttr)
