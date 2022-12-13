// Check if protocol method is allowed for current rpc
export const methodCheck = ({ rpcAdapter: { checkMethod }, method }) => {
  checkMethod({ method })
}
