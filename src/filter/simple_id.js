import { intersection } from '../utils/functional/intersection.js'
import { uniq } from '../utils/functional/uniq.js'

// Try to guess the model `id`s by looking at `args.filter`
// This won't work on top-level filter of findMany command using a complex one,
// but that's ok because it will not have any concurrent commands.
// Returns undefined if it is impossible to guess. Returns empty array if the
// client specifically asked for no `id`s,
// e.g. `{ filter: { id: { _in: [] } } }`
export const extractSimpleIds = ({
  filter: { type, attrName, value } = {},
}) => {
  if (type === '_and') {
    return parseAndNode({ value })
  }

  const isSimple = isSimpleFilter({ type, attrName })

  if (!isSimple) {
    return
  }

  const ids = getIds({ type, value })
  return ids
}

// Parses '_and' top-level node
const parseAndNode = ({ value }) => {
  const idsA = value.map((node) => extractSimpleIds({ filter: node }))

  const isSimple = idsA.every((ids) => Array.isArray(ids))

  // E.g. `{ id: '5', name: '...' }`
  if (!isSimple) {
    return
  }

  const idsB = intersection(...idsA)
  return idsB
}

// Check if `args.filter` is simple enough to guess model `id`s
const isSimpleFilter = ({ type, attrName }) => {
  // Means there is no filter
  if (type === undefined) {
    return false
  }

  return attrName === 'id' && SIMPLE_TYPES.has(type)
}

const SIMPLE_TYPES = new Set(['_eq', '_in'])

const getIds = ({ type, value }) => {
  // Use either type `_eq` or `_in`
  const ids = type === '_in' ? value : [value]

  const idsA = uniq(ids)

  return idsA
}

// Returns simple `args.filter` that only filters by `model.id`
export const getSimpleFilter = ({ ids }) =>
  ids.length === 1
    ? { attrName: 'id', type: '_eq', value: ids[0] }
    : { attrName: 'id', type: '_in', value: uniq(ids) }
