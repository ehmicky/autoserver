import { throwError } from '../../errors/main.js'

import { getColl } from './get_coll.js'

// Validate that attributes used in nested actions will not change
// If a nested action is performed by the client, but the server changes its
// parent attribute with `attr.value|readonly`, the relation returned
// in the response will show what the client asked for, but the server state
// will contain something else.
// Other solutions all have drawbacks, i.e.:
//  - forbid `attr.value|readonly` in config:
//     - too restrictive, e.g. author plugin requires `attr.value|readonly`
//  - only throw this error if client and server values do not match:
//     - this is less predictable for the client.
//     - this makes any change on `attr.value|readonly` a breaking
//       change, because client queries that used to work might then throw.
//  - do not perform the nested action:
//     - requires client to check response
//     - means response can have different shapes
//     - request is a success, but actually some of it was not performed
//  - perform nested action but do not return them in response:
//     - similar drawbacks as the one just above
//  - ignore the server-side modification from the response:
//     - no way for client to know response does not match current data state
//  - replace nested actions by find actions:
//     - request might not be authorized to fetch those models
export const validateStableIds = ({
  actions,
  config,
  top,
  top: { command },
}) => {
  // Only for commands with `args.data`
  if (!STABLE_IDS_COMMANDS.has(command.type)) {
    return
  }

  actions
    // Only for nested actions
    .filter(({ commandpath }) => commandpath.length !== 0)
    .forEach((action) => {
      validateAction({ action, config, top })
    })
}

const STABLE_IDS_COMMANDS = new Set(['create', 'patch', 'upsert'])

const validateAction = ({ action: { commandpath }, config, top }) => {
  const serverSet = isServerSet({ commandpath, config, top })

  if (!serverSet) {
    return
  }

  const path = commandpath.join('.')
  const message = `Cannot nest 'data' argument on '${path}'. That attribute's value might be modified by the server, so the nested collection's 'id' cannot be known by the client.`
  throwError(message, { reason: 'VALIDATION' })
}

const isServerSet = ({ commandpath, config, top }) => {
  const attr = getAttr({ commandpath, config, top })
  const serverSet = attr.readonly !== undefined || attr.value !== undefined
  return serverSet
}

const getAttr = ({ commandpath, config, config: { collections }, top }) => {
  const parentPath = commandpath.slice(0, -1)
  const { collname } = getColl({ commandpath: parentPath, top, config })
  const attrName = commandpath.at(-1)
  const { attributes } = collections[collname]
  const attr = attributes[attrName]
  return attr
}
