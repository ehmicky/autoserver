// Fires rpc layer
export const fireRpc = (mInput, nextLayer) => nextLayer(mInput, 'rpc')
