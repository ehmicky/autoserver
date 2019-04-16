// Fires rpc layer
export const fireRpc = function(mInput, nextLayer) {
  return nextLayer(mInput, 'rpc')
}
