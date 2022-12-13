export const parseInput = ({
  protocolAdapter: { getInput },
  specific,
  method,
}) => getInput({ specific, method })
