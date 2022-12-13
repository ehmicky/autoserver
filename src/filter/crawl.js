import { groupBy } from '../utils/functional/group.js'

import {
  PARENT_OPERATORS,
  ATTR_PARENT_OPERATORS,
  ATTR_ANCESTOR_OPERATORS,
} from './operators/main.js'

// Call `func(node)` recursively over each node of `args.filter`
// Returns array of func() return values
export const crawlNodes = (node, func) => {
  const children = getNodeChildren(node)
  const childrenA = children.flatMap((child) => crawlNodes(child, func))

  const returnValue = func(node)

  if (returnValue === undefined) {
    return childrenA
  }

  return [returnValue, ...childrenA]
}

const getNodeChildren = ({ type, value }) => {
  if (!PARENT_OPERATORS.has(type)) {
    return []
  }

  return value
}

// Call `func(node)` recursively over each attribute of `args.filter`
// Returns array of func() return values
export const crawlAttrs = (node, func) => {
  const { type, value } = node

  if (!ATTR_ANCESTOR_OPERATORS.has(type)) {
    const returnValue = getAttrs(node, func)
    return [...returnValue, value]
  }

  const children = value.flatMap((child) => crawlAttrs(child, func))
  return children
}

const getAttrs = (node, func) => {
  const { type, value } = node

  if (!ATTR_PARENT_OPERATORS.has(type)) {
    return func([node]) || []
  }

  const groups = groupBy(value, 'attrName')
  const attrs = Object.entries(groups).map(([attrName, group]) =>
    func(group, attrName),
  )
  return attrs
}

// Call `func(node)` recursively over each node of `args.filter`
// Returns node recursively mapped
export const mapNodes = (node, func) => {
  const value = mapChildren(node, func)
  const nodeA = value === undefined ? node : { ...node, value }

  const nodeB = func(nodeA)
  return nodeB
}

const mapChildren = ({ type, value }, func) => {
  if (!PARENT_OPERATORS.has(type)) {
    return value
  }

  return value.map((child) => mapNodes(child, func))
}
