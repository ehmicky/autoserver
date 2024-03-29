import { mapNodes } from '../../../filter/crawl.js'
import { isSiblingValue } from '../../../filter/siblings.js'

// Modify `args.filter`
export const renameFilter = ({ value, newIdName, oldIdName }) =>
  mapNodes(value, (node) => renameFilterId({ node, newIdName, oldIdName }))

const renameFilterId = ({ node, newIdName, oldIdName }) => {
  const nodeA = renameFilterSiblings({ node, newIdName, oldIdName })

  if (nodeA.attrName !== oldIdName) {
    return nodeA
  }

  return { ...nodeA, attrName: newIdName }
}

const renameFilterSiblings = ({
  node,
  node: { value },
  newIdName,
  oldIdName,
}) => {
  if (!isSiblingValue({ value })) {
    return node
  }

  const { value: attrName } = value

  if (attrName !== oldIdName) {
    return node
  }

  const nodeA = { ...node, value: { ...value, value: newIdName } }
  return nodeA
}
