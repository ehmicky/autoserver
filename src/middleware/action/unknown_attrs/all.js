import { throwError } from '../../../errors/main.js'

// Validate correct usage of special key 'all'
export const validateAllAttr = ({
  action: {
    args: { select },
    collname,
  },
  config: { collections },
}) => {
  if (select === undefined) {
    return
  }

  const hasAllAttr = select.includes('all')

  if (!hasAllAttr) {
    return
  }

  const keyA = select
    .filter((key) => key !== 'all')
    .find((key) => collections[collname].attributes[key].target === undefined)

  if (keyA === undefined) {
    return
  }

  const message = `Argument 'select' cannot target both 'all' and '${keyA}' attributes`
  throwError(message, { reason: 'VALIDATION' })
}
