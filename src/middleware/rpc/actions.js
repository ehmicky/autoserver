// Fire actions, unless the response is already known
export const fireActions = ({ response, mInput }, nextLayer) => {
  // When the rpc parser already returned the response,
  // e.g. with GraphQL introspection queries
  if (response) {
    return
  }

  return nextLayer(mInput, 'action')
}
