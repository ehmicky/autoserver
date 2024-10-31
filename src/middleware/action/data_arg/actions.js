import { getNestedActions, getNestedKeys } from './nested.js'
import { getWriteAction } from './write_action.js'

// Parse an object (including its children) inside `args.data`
// as a set of write actions
export const parseActions = ({ data, ...rest }) => {
  const dataA = normalizeData({ data })

  const nestedKeys = getNestedKeys({ data: dataA, ...rest })
  // Pass `parseActions` for recursion
  const nestedActions = getNestedActions({
    parseActions,
    data: dataA,
    nestedKeys,
    ...rest,
  })
  const action = getWriteAction({ data: dataA, nestedKeys, ...rest })
  const actionA = filterAction({ action })
  return [...actionA, ...nestedActions]
}

// Commands are normalized to being only multiple
// So we also normalize `args.data` to always be an array
const normalizeData = ({ data }) => (Array.isArray(data) ? data : [data])

// Do not create actions with empty `args.data`
const filterAction = ({
  action,
  action: {
    args: { data },
  },
}) => {
  const isEmptyAction = data.length === 0

  if (isEmptyAction) {
    return []
  }

  return [action]
}
