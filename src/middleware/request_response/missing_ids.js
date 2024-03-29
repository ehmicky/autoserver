import { throwPb } from '../../errors/props.js'
import { extractSimpleIds, getSimpleFilter } from '../../filter/simple_id.js'
import { difference } from '../../utils/functional/difference.js'

// Check if any `id` was not found (404) or was unauthorized (403)
export const validateMissingIds = (
  {
    command,
    clientCollname,
    response,
    args: { filter, preFilter },
    commandpath,
    top,
    mInput,
  },
  nextLayer,
) => {
  const noValidate = doesNotValidate({ command, top, commandpath })

  if (noValidate) {
    return
  }

  const ids = getMissingIds({ filter, preFilter, response })

  if (ids.length === 0) {
    return
  }

  return reportProblem({
    top,
    clientCollname,
    preFilter,
    ids,
    nextLayer,
    mInput,
  })
}

const doesNotValidate = ({ command, top, commandpath }) =>
  command !== 'find' ||
  // `create`'s currentData query is skipped.
  top.command.type === 'create' ||
  // Top-level `findMany|patchMany|deleteMany` are not checked because:
  //  - it would only be applied if filter is simple, i.e. behavior is less
  //    predictable for the client
  //  - it makes less sense from semantic point of view
  //  - pagination prevents guessing missing ids
  (FILTER_MANY_COMMANDS.has(top.command.name) && commandpath === '')

// Commands with a `filter` argument
const FILTER_MANY_COMMANDS = new Set(['findMany', 'patchMany', 'deleteMany'])

// Retrieve missing models ids
const getMissingIds = ({ filter, preFilter, response: { data } }) => {
  const filterA = preFilter === undefined ? filter : preFilter
  const filterIds = extractSimpleIds({ filter: filterA })

  // This middleware can be checked only when filtering only by `id`.
  // Checking complex `args.filter` is tricky. It is hard to know whether a
  // model is missing because it does not exist, because it was filter by
  // authorization filter, or because it was filter by user-specified
  // `args.filter`.
  // This means that in general, findMany|deleteMany|updateMany top-level
  // actions won't use this middleware, unless they are using very simple
  // `args.filter` like `{ id: { _in: ['4', '5'] } }`
  if (filterIds === undefined) {
    return []
  }

  const responseIds = new Set(data.map(({ id }) => id))
  const ids = filterIds.filter((id) => !responseIds.has(id))

  return ids
}

// Check whether this is because the model does not exist,
// or because it is not authorized
const reportProblem = async ({ top, clientCollname, ...rest }) => {
  const idsA = await checkAuthorization({ top, clientCollname, ...rest })

  // `upsert` commands might throw authorization errors, but not model not found
  if (top.command.type === 'upsert') {
    return
  }

  throwPb({
    reason: 'NOT_FOUND',
    extra: { collection: clientCollname, ids: idsA },
  })
}

// Try the same database query, but this time without the authorization filter,
// and only on the missing models.
// If no missing model is missing anymore, flag it as an authorization error.
const checkAuthorization = async ({
  top,
  clientCollname,
  preFilter,
  ids,
  nextLayer,
  mInput,
  mInput: { args },
}) => {
  if (preFilter === undefined) {
    return ids
  }

  const filterA = getSimpleFilter({ ids })
  const mInputA = { ...mInput, args: { ...args, filter: filterA } }

  const { dbData } = await nextLayer(mInputA, 'database')

  const responseIds = dbData.map(({ id }) => id)
  const missingIds = difference(ids, responseIds)

  if (missingIds.length !== 0) {
    return missingIds
  }

  throwPb({
    reason: 'AUTHORIZATION',
    extra: { collection: clientCollname, ids },
    messageInput: { top },
  })
}
