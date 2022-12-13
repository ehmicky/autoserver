import { applyDataAliases } from './data.js'
import { applyOrderAliases } from './order.js'

// Apply `alias` in server input
export const applyInputAliases = ({ args, modelAliases }) => {
  const argsB = Object.entries(modelAliases).reduce(
    (argsA, [attrName, aliases]) =>
      applyInputAlias({ args: argsA, attrName, aliases }),
    args,
  )
  return { args: argsB }
}

const applyInputAlias = ({ args = {}, attrName, aliases }) =>
  modifiers.reduce(
    (argsA, modifier) => modifier({ args: argsA, attrName, aliases }),
    args,
  )

const getNewData = ({
  args,
  args: { newData, currentData },
  attrName,
  aliases,
}) => {
  if (!newData) {
    return args
  }

  const newDataA = applyDataAliases({
    newData,
    currentData,
    attrName,
    aliases,
  })
  return { ...args, newData: newDataA }
}

const getOrder = ({ args, args: { order }, attrName, aliases }) => {
  if (!order) {
    return args
  }

  const orderA = applyOrderAliases({ order, attrName, aliases })
  return { ...args, order: orderA }
}

const modifiers = [getNewData, getOrder]
