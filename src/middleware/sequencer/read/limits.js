import { throwPb } from '../../../errors/props.js'

// Only start a command if we know it won't hit the `maxmodels` limit
export const validateMaxmodels = ({ results, allIds, maxmodels, top }) => {
  const shouldValidate = shouldValidateMaxmodels({ top })

  if (!shouldValidate) {
    return
  }

  // Top-level action
  if (results.length === 0) {
    return
  }

  incrementCount({ results, allIds })

  if (results.count <= maxmodels) {
    return
  }

  const message = `The response must contain at most ${maxmodels} models, including nested models, but there are ${results.count} of them`
  throwPb({
    reason: 'PAYLOAD_LIMIT',
    message,
    extra: { value: results.count, limit: maxmodels },
  })
}

const incrementCount = ({ results, allIds }) => {
  // First nested action needs to add top-level action's count
  if (results.count === undefined) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    results.count = results.length
  }

  // We need to mutate variables since several commands are fired in parellel
  // and must share state, to avoid any being fired for nothing
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  results.count += allIds.length
}

// `maxmodels` is not checked against:
//  - find: as it is paginated instead
//  - delete: as it has no limits
//    However dryrun deletes effectively behave as `find` commands, and we
//    want to avoid using them as a way to circumvent `maxmodels`, so we
//    apply it on dryrun deletes
//  - create|upsert: as it is checked during `args.data` parsing instead
const shouldValidateMaxmodels = ({
  top: {
    command: { type: command },
    args: { dryrun },
  },
}) => command === 'patch' || (command === 'delete' && dryrun)
