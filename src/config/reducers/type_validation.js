import { mapAttrs } from '../helpers.js'

// Add JSON schema validation based on `type`
const mapAttr = ({ attr, attr: { type, isArray } }) => {
  if (!type) {
    return
  }

  if (!isArray) {
    return addSingleValidation(attr)
  }

  return addMultipleValidation(attr)
}

const addSingleValidation = ({ type, validate }) => ({
  validate: { ...validate, type },
})

const addMultipleValidation = ({
  type,
  validate,
  validate: { items = {} },
}) => ({
  validate: {
    ...validate,
    type: 'array',
    items: { ...items, type },
  },
})

export const addTypeValidation = mapAttrs.bind(undefined, mapAttr)
