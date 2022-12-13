import { getRpc } from '../../rpc/get.js'
import { RPCS } from '../../rpc/info.js'

// Fire each `rpcAdapter.load({ config })` function
export const loadRpc = ({ config }) => {
  const output = RPCS.map((rpc) => loadSingleRpc({ rpc, config }))
  const outputA = Object.assign({}, ...output)
  return outputA
}

const loadSingleRpc = ({ rpc, config }) => {
  const { load } = getRpc(rpc)

  if (load === undefined) {
    return
  }

  return load({ config })
}
