import { throwError } from '../../../errors/main.js'
import { uniq } from '../../../utils/functional/uniq.js'

import { validateAllAttr } from './all.js'

// Validate that attributes in `args.select|data|order` are in the
// config.
// Also validate special key 'all'
// `args.cascade` is not validated because already previously checked.
export const validateUnknownAttrs = ({ actions, config }) => {
  actions.forEach((action) => {
    validateAction({ action, config })
  })
}

const validateAction = ({ action, config }) => {
  validateAllAttr({ action, config })
  validateUnknown({ action, config })
}

// Validate that arguments's attributes are present in config
const validateUnknown = ({ action, config }) => {
  argsToValidate.forEach(({ name, getKeys }) => {
    const keys = getKeys({ action })
    validateUnknownArg({ keys, action, config, name })
  })
}

const getSelectKeys = ({
  action: {
    args: { select = [] },
  },
}) => select.filter((key) => key !== 'all')

const getRenameKeys = ({
  action: {
    args: { rename = [] },
  },
}) => rename.map(({ key }) => key)

// Turn e.g. [{ a, b }, { a }] into ['a', 'b']
const getDataKeys = ({
  action: {
    args: { data = [] },
  },
}) => {
  const keys = data.flatMap(Object.keys)
  const keysA = uniq(keys)
  return keysA
}

const getOrderKeys = ({
  action: {
    args: { order = [] },
  },
}) => order.map(({ attrName }) => attrName)

// Each argument type has its own way or specifying attributes
const argsToValidate = [
  { name: 'select', getKeys: getSelectKeys },
  { name: 'rename', getKeys: getRenameKeys },
  { name: 'data', getKeys: getDataKeys },
  { name: 'order', getKeys: getOrderKeys },
]

const validateUnknownArg = ({
  keys,
  action: { commandpath, collname },
  config: { collections },
  name,
}) => {
  const keyA = keys.find(
    (key) => collections[collname].attributes[key] === undefined,
  )

  if (keyA === undefined) {
    return
  }

  const path = [...commandpath, keyA].join('.')
  const message = `In '${name}' argument, attribute '${path}' is unknown`
  throwError(message, { reason: 'VALIDATION' })
}
