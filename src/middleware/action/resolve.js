'use strict';

// Fire all read or write actions, retrieving some `results`
const resolveActions = function (
  { top: { command: { type: topCommand } }, mInput },
  nextLayer,
) {
  const layerName = topCommand === 'find' ? 'read' : 'write';
  return nextLayer(mInput, layerName);
};

module.exports = {
  resolveActions,
};
