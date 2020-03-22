// Retrieves protocol request's input
// TODO: remove specific
export const parseProtocol = function (
  { protocolAdapter: { parseRequest }, config },
  nextLayer,
  { measures },
) {
  return parseRequest({ config, measures })
}
