import { v4 as uuidv4 } from 'uuid'

import { getModelParams } from '../../../functions/params/values.js'
import { runConfigFunc } from '../../../functions/run.js'

// Add default model.id for create commands, in order of priority:
//  - nested `args.data` attribute (not handled here)
//  - current collection's 'id' attribute's config 'default'
//  - database adapter-specific function
//  - UUIDv4
// eslint-disable-next-line complexity
export const addDefaultIds = function ({ datum, top: { command }, ...rest }) {
  const shouldAddDefaultId =
    command.type === 'create' && (datum.id === undefined || datum.id === null)

  if (!shouldAddDefaultId) {
    return datum
  }

  const id = handlers.reduce(
    getIdDefault.bind(undefined, { ...rest, datum, command }),
    undefined,
  )

  if (id === undefined) {
    return datum
  }

  return { ...datum, id }
}

// Try each way to set default, in order
const getIdDefault = function (input, id, handler) {
  if (id !== undefined) {
    return id
  }

  return handler(input)
}

// Apply default current collection's 'id' attribute
const applyConfigDefault = function ({
  collname,
  command,
  datum,
  userDefaultsMap,
  mInput,
}) {
  const configFunc = userDefaultsMap[collname].id

  if (configFunc === undefined || configFunc === null) {
    return
  }

  const params = getModelParams({
    model: datum,
    previousmodel: undefined,
    attrName: 'id',
  })
  const mInputA = { ...mInput, collname, command: command.type }
  return runConfigFunc({ configFunc, mInput: mInputA, params })
}

// Apply database adapter-specific id default, i.e. adapter.getDefaultId()
// Database adapters should prefer using UUID, to keep it consistent
const applyDatabaseDefault = function ({ collname, dbAdapters }) {
  const { getDefaultId } = dbAdapters[collname]

  if (getDefaultId === undefined) {
    return
  }

  return getDefaultId()
}

// UUID default fallback
const applyUuid = function () {
  return uuidv4()
}

const handlers = [applyConfigDefault, applyDatabaseDefault, applyUuid]
