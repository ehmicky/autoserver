const { isObject } = require('../../../utils/functional/type.js')

// Copy first defined alias to main attribute, providing it is not defined.
const applyOrderAliases = function({ order, attrName, aliases }) {
  if (!Array.isArray(order)) {
    return order
  }

  return order.map(orderPart => {
    if (!isObject(orderPart)) {
      return orderPart
    }

    if (!aliases.includes(orderPart.attrName)) {
      return orderPart
    }

    return { ...orderPart, attrName }
  })
}

module.exports = {
  applyOrderAliases,
}
