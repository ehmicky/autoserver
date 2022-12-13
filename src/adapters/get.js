// Retrieve an adapter by its name
export const getAdapter = ({ adapters, key, name }) => {
  const adapter = adapters[key]

  if (adapter !== undefined) {
    return adapter.wrapped
  }

  throw new Error(`Unsupported ${name}: '${key}'`)
}

// Retrieve all adapters' names
export const getNames = (adapters) => adapters.map(({ name }) => name)

// Retrieve all fields of adapters, for a given field
export const getMember = (adapters, member, defaultValue) => {
  const members = adapters.map((adapter) =>
    getAdapterMember({ adapter, member, defaultValue }),
  )
  const membersA = Object.assign({}, ...members)
  return membersA
}

const getAdapterMember = ({ adapter, member, defaultValue }) => {
  const memberA = adapter[member]
  const memberB = memberA === undefined ? defaultValue : memberA
  return { [adapter.name]: memberB }
}
