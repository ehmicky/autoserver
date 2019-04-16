import pluralize from 'pluralize'

import { getWordsList } from '../../utils/string.js'
import { throwPb } from '../../errors/props.js'
import { getLimits } from '../../limits.js'

import { getColl } from './get_coll.js'

// Validate request limits
const validateRequestLimits = function({ config, mInput }) {
  const limits = getLimits({ config })

  validators.forEach(validator => validator({ ...mInput, limits }))
}

const validateMaxActions = function({ limits: { maxActions }, actions }) {
  if (actions.length <= maxActions) {
    return
  }

  const value = actions.length - 1
  const limit = maxActions - 1
  const message = `The request must contain less than ${limit} nested commands, but there are ${value} of them`
  throwPb({ reason: 'PAYLOAD_LIMIT', message, extra: { value, limit } })
}

// Nested patch|create|upsert commands use `maxmodels` instead
// Nested delete commands are not limited, as they are meant not to be performed
// several times
const validateNestedFind = function({ limits, actions, top, config }) {
  if (top.command.type !== 'find') {
    return
  }

  const tooNestedActions = actions.filter(action =>
    isTooNestedFind({ action, config, top, limits }),
  )

  if (tooNestedActions.length === 0) {
    return
  }

  const paths = tooNestedActions.map(({ commandpath }) => commandpath.join('.'))
  const pathsA = getWordsList(paths, { op: 'and', quotes: true })

  const extra = getNestedFindExtra({ tooNestedActions, limits })

  const message = `The following ${pluralize(
    'command',
    paths.length,
  )} ${pluralize(
    'is',
    paths.length,
  )} nested too deeply: ${pathsA}. 'find' commands can only target collections at the top level or the second level.`
  throwPb({ reason: 'PAYLOAD_LIMIT', message, extra })
}

const isTooNestedFind = function({
  action: { commandpath },
  config,
  top,
  limits: { maxFindManyDepth },
}) {
  if (commandpath.length < maxFindManyDepth) {
    return false
  }

  const { multiple } = getColl({ commandpath, top, config })
  return multiple
}

const getNestedFindExtra = function({
  tooNestedActions,
  limits: { maxFindManyDepth },
}) {
  const values = tooNestedActions.map(({ commandpath }) => commandpath.length)
  const value = Math.max(...values)
  const limit = maxFindManyDepth - 1

  return { value, limit }
}

// Validate `args.data` against `maxmodels` limit
const validateMaxData = function({
  actions,
  limits: { maxmodels },
  top: { command },
}) {
  // Not applied to:
  //  - find|patch commands: applied later since response size is not known yet
  //  - delete commands: they are never limited
  if (!MAX_DATA_COMMANDS.includes(command.type)) {
    return
  }

  const dataA = actions.flatMap(({ args: { data } }) => data)
  const value = dataA.length
  const limit = maxmodels

  if (value <= limit) {
    return
  }

  const message = `The 'data' argument must not contain more than ${limit} models, but it contains ${value} models, including nested models`
  throwPb({ reason: 'PAYLOAD_LIMIT', message, extra: { value, limit } })
}

const MAX_DATA_COMMANDS = ['create', 'upsert']

const validators = [validateMaxActions, validateNestedFind, validateMaxData]

module.exports = {
  validateRequestLimits,
}
