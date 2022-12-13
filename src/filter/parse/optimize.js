import { mapNodes } from '../crawl.js'
import { getOperator } from '../operators/main.js'

// Try to simplify AST
export const optimizeFilter = ({ filter }) => mapNodes(filter, optimizeNode)

const optimizeNode = (node) => {
  const { optimize } = getOperator({ node })

  if (optimize === undefined) {
    return node
  }

  const nodeA = optimize(node)
  return nodeA
}
