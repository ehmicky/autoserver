// Check if protocol method is allowed for current rpc
export const methodCheck = function({ rpcAdapter: { checkMethod }, method }) {
  checkMethod({ method })
}
