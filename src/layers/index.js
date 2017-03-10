'use strict';


/**
 * Layers are similar to Express middleware, with the following differences:
 *  - they follow a stack structure, not a pipe structure:
 *     - i.e. each upper layer calls a lower layer, retrieves its return value then keeps going
 *     - this allows layers to thought as "onion layers", where each upper layer can remove a level of abstraction from lower layers
 *        - e.g. if only the uppermost layer deals with network protocols (e.g. HTTP),
 *          the lower layers can ignore it for both the request and the response
 *  - when an upper layer calls a lower layer, the first argument must be an object (because some meta-information is assigned to it)
 *  - layers are organized in "layer groups":
 *     - a layer group is a group of layers whose `request` and `response` objects structure is consistent
 *     - validation functions are applied to make sure the object is not corrupted
 *  - layers can provide a test function, to check whether it should be entered
 *  - by using an array of layers, one can specify 'at most one of those layers will be fired'
 **/


const LayerError = require('./layer_error');


const layers = {
  groupsOrder: [],
  groups: {},
}

const defineLayers = ({ groupsOrder, groups }) => {
  Object.assign(layers, { groupsOrder, groups });
};

const layerInfoSym = Symbol('layerInfo');
// First iteration
const start = function (...args) {
  args[0][layerInfoSym] = {};
  return next(...args);
};

const next = function (...args) {
  let layerInfo = args[0][layerInfoSym];
  if (!layerInfo) {
    throw new LayerError('Tried to call next layer, but the input object is of the wrong type');
  }

  // Retrieve next iteration
  const { group, name } = layerInfo;
  args[0][layerInfoSym] = layerInfo = getNext({ group, name, args });

  // End of iteration
  if (!layerInfo || !layerInfo.handler) { return args[0]; }

  // Next iteration
  return layerInfo.handler(...args);
};

const getNext = function({ group = layers.groupsOrder[0], name: currentLayer, args }) {
  const nextLayers = getNextLayers({ group, currentLayer });
  const nextLayer = getRightLayer({ layers: nextLayers, args });

  if (!nextLayer) {
    const currentLayerGroupsIndex = layers.groupsOrder.indexOf(group);
    if (currentLayerGroupsIndex === layers.groupsOrder.length - 1) { return; }
    return getNext({ group: layers.groupsOrder[currentLayerGroupsIndex + 1], name: null })
  }

  return {
    group,
    name: nextLayer.name,
    handler: nextLayer.handler,
  };
};

const getNextLayers = function ({ group, currentLayer }) {
  const currentLayerIndex = currentLayer && layers.groups[group].layers.findIndex(layers => {
    layers = layers instanceof Array ? layers : [layers];
    return layers.some(layer => layer.name === currentLayer);
  });
  const nextLayerIndex = currentLayerIndex == null ? 0 : currentLayerIndex + 1;
  const nextLayers = layers.groups[group].layers[nextLayerIndex];
  return nextLayers;
};

const getRightLayer = function ({ layers, args }) {
  if (!layers) { return; }
  layers = layers instanceof Array ? layers : [layers];
  return layers.find(layer => !layer.test || layer.test(...args));
};

module.exports = {
  defineLayers,
  start,
  next,
  layerInfoSym,
};