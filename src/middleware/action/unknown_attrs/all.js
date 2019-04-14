'use strict'

const { throwError } = require('../../../errors/main.js')

// Validate correct usage of special key 'all'
const validateAllAttr = function({
  action: {
    args: { select },
    collname,
  },
  config: { collections },
}) {
  if (select === undefined) {
    return
  }

  const hasAllAttr = select.some(key => key === 'all')

  if (!hasAllAttr) {
    return
  }

  const keyA = select
    .filter(key => key !== 'all')
    .find(key => collections[collname].attributes[key].target === undefined)

  if (keyA === undefined) {
    return
  }

  const message = `Argument 'select' cannot target both 'all' and '${keyA}' attributes`
  throwError(message, { reason: 'VALIDATION' })
}

module.exports = {
  validateAllAttr,
}
