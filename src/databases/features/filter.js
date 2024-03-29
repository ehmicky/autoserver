import { difference } from '../../utils/functional/difference.js'
import { getWordsList } from '../../utils/string.js'

// Adapter feature 'filter:_OPERATOR' allows for
// `args.filter: { attrName: { _OPERATOR: value } }`
export const filterValidator = ({ features, filterFeatures }) => {
  const ops = getOps({ features, filterFeatures })

  if (ops.length === 0) {
    return
  }

  if (ops.includes('_or')) {
    return "In 'filter' argument, must not use an array of alternatives"
  }

  if (ops.includes('sibling')) {
    return "In 'filter' argument, must not use values prefixed with 'model.'"
  }

  const opsA = getWordsList(ops, { op: 'nor', quotes: true })
  return `In 'filter' argument, must not use the operators ${opsA}`
}

const getOps = ({ features, filterFeatures }) =>
  difference(filterFeatures, features).map((feature) =>
    feature.replace(/.*:/u, ''),
  )
