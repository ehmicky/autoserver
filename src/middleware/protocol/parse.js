// Retrieves protocol request's input
// TODO: remove specific
export const parseProtocol = (
  { protocolAdapter: { parseRequest }, config },
  nextLayer,
  { measures },
) => parseRequest({ config, measures })
