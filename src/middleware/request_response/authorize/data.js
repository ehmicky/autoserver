import { throwPb } from '../../../errors/props.js'
import { evalFilter } from '../../../filter/eval.js'

// Check `model.authorize` `model.*` against `args.newData`
const checkNewData = function({
  authorize,
  args: { newData },
  clientCollname,
  top,
}) {
  if (newData === undefined) {
    return
  }

  const ids = newData
    .filter(datum => !evalFilter({ filter: authorize, attrs: datum }))
    .map(({ id }) => id)

  if (ids.length === 0) {
    return
  }

  throwPb({
    reason: 'AUTHORIZATION',
    messageInput: { top },
    extra: { collection: clientCollname, ids },
  })
}

module.exports = {
  checkNewData,
}
