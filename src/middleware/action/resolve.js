// Fire all read or write actions, retrieving some `results`
export const resolveActions = function(
  { top: { command }, mInput },
  nextLayer,
) {
  const layerName = command.type === 'find' ? 'read' : 'write'
  return nextLayer(mInput, layerName)
}
