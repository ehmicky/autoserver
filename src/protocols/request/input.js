export const parseInput = function ({
  protocolAdapter: { getInput },
  specific,
  method,
}) {
  return getInput({ specific, method })
}
