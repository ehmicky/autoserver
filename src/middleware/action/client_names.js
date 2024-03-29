// Sets `clientCollname` and `clientCollnames`
// Those are the same, but using client-facing collection name, which might be
// different because of `collection.name`
// They are used only in client-facing situations, i.e. in error responses,
// in request method names and in documentation.
// Note that `commandpath`, `commandpaths` and `summary` are always using
// the client-facing names.
export const setClientNames = ({ config, actions, collnames, top }) => {
  const actionsA = actions.map((action) =>
    setClientNamesActions({ config, action, top }),
  )
  const clientCollnames = collnames.map((collname) =>
    getClientCollname({ config, collname, top }),
  )

  return { actions: actionsA, clientCollnames }
}

const setClientNamesActions = ({
  config,
  action,
  action: { collname },
  top,
}) => {
  const clientCollname = getClientCollname({ config, collname, top })
  return { ...action, clientCollname }
}

const getClientCollname = ({ config: { collections }, collname, top }) => {
  // Reuse client-supplied collection name.
  if (top.collname === collname) {
    return top.clientCollname
  }

  // Otherwise, use first available
  const [clientCollname] = collections[collname].name
  return clientCollname
}
