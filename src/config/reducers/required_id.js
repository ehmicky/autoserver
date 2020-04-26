import { mapAttrs } from '../helpers.js'

// Make sure `id` attributes are required
const mapAttr = function ({
  attr: {
    validate,
    validate: { required },
  },
  attrName,
}) {
  if (attrName !== 'id' || required) {
    return
  }

  return { validate: { ...validate, required: true } }
}

export const addRequiredId = mapAttrs.bind(undefined, mapAttr)
