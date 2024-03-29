import { throwError } from '../../errors/main.js'
import { includes } from '../../utils/functional/includes.js'
import { uniq } from '../../utils/functional/uniq.js'

import { addActions } from './add_actions/merge.js'
import { getColl } from './get_coll.js'

// Parse `args.populate|cascade` into a set of nested `actions`
export const parsePopulateCascade = ({ actions, ...rest }) => {
  const actionsA = addActions({
    actions,
    filter: ['populate', 'cascade'],
    mapper: getActions,
    ...rest,
  })
  return { actions: actionsA }
}

const getActions = ({ top, top: { command }, action: { args }, config }) => {
  const argName = ARG_NAMES[command.type]
  const arg = args[argName]

  const attrs = arg.split(',')
  const attrsA = uniq(attrs)
  const attrsB = attrsA.map((attrName) => attrName.split('.'))
  const actions = attrsB.map((attrName) =>
    getAction({ attrName, attrs: attrsB, top, config, argName }),
  )
  return actions
}

// `args.cascade` is the alias for `args.populate` on delete actions
const ARG_NAMES = {
  find: 'populate',
  delete: 'cascade',
}

// From `attr.child_attr` to:
//   commandpath: ['commandName', 'attr', 'child_attr']
//   collname
//   args: {}
const getAction = ({ attrName, attrs, top, config, argName }) => {
  validateMiddleAction({ attrName, attrs, argName })

  const commandpath = [...top.commandpath, ...attrName]
  const coll = getColl({ top, config, commandpath })

  validateModel({ coll, commandpath, argName })

  const { collname } = coll

  return { commandpath, collname, args: {} }
}

// Cannot specify `args.populate|cascade` `parent.child` but not `parent`.
// Otherwise, this would require create an intermediate `find` action.
const validateMiddleAction = ({ attrName, attrs, argName }) => {
  // Not for top-level attributes
  if (attrName.length <= 1) {
    return
  }

  const parentAttr = attrName.slice(0, -1)
  const hasParentAttr = includes(attrs, parentAttr)

  if (hasParentAttr) {
    return
  }

  const message = `In '${argName}' argument, must not specify '${attrName.join(
    '.',
  )}' unless '${parentAttr.join('.')}' is also specified`
  throwError(message, { reason: 'VALIDATION' })
}

const validateModel = ({ coll, commandpath, argName }) => {
  if (coll !== undefined) {
    return
  }

  const attrName = commandpath.join('.')
  const message =
    attrName === ''
      ? `'${argName}' argument cannot contain empty attributes`
      : `In '${argName}' argument, attribute '${attrName}' is unknown`
  throwError(message, { reason: 'VALIDATION' })
}
