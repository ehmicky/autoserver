import { throwPb } from '../errors/props.js'

// Check if protocol method is allowed for current rpc
const checkMethod = function({ methods, title }, { method }) {
  if (isAllowedMethod({ methods, method })) {
    return
  }

  const message = `Invalid protocol with ${title}`
  throwPb({
    reason: 'METHOD',
    message,
    extra: { value: method, suggestions: methods },
  })
}

const isAllowedMethod = function({ methods, method }) {
  return (
    methods === undefined ||
    methods.includes(method) ||
    // If only method is allowed by the rpc, but the protocol does not have
    // a getMethod(), we do not force specifying `method`
    (methods.length === 1 && method === undefined)
  )
}

module.exports = {
  checkMethod,
}
