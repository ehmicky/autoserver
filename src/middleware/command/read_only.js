'use strict';


const { omit, assignObject } = require('../../utilities');


/**
 * Removes attributes marked in IDL as `readOnly`.
 * This is done silently (i.e. does not raise warnings or errors),
 * because readonly attributes can be part of a normal response, and clients
 * should be able to send responses back as is without having to remove
 * readonly attributes.
 **/
const handleReadOnly = function ({ idl, serverState: { startupLog } }) {
  const perf = startupLog.perf.start('command.handleReadOnly', 'middleware');
  const readOnlyMap = getReadOnlyMap({ idl });
  perf.stop();

  return async function handleReadOnly(input) {
    const { args, modelName, log } = input;
    const { newData } = args;
    const perf = log.perf.start('command.handleReadOnly', 'middleware');

    // Remove readonly attributes in `args.newData`
    if (newData) {
      const readOnlyAttrs = readOnlyMap[modelName];
      args.newData = newData instanceof Array
        ? newData.map(datum => removeReadOnly({
          newData: datum,
          readOnlyAttrs,
        }))
        : removeReadOnly({ newData, readOnlyAttrs });
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Gets a map of models' readonly attributes,
// e.g. { my_model: ['my_readonly_attribute', ...], ... }
const getReadOnlyMap = function ({ idl: { models } }) {
  return Object.entries(models)
    .map(([modelName, { properties = {} }]) => {
      const readOnlyProps = Object.entries(properties)
        .filter(([, { readOnly }]) => readOnly)
        .map(([attrName]) => attrName);
      return { [modelName]: readOnlyProps };
    })
    .reduce(assignObject, {});
};

const removeReadOnly = function ({ newData, readOnlyAttrs }) {
  // Value should be an object if valid, but it might be invalid
  // since the validation layer is not fired yet on input
  if (!newData || newData.constructor !== Object) { return newData; }

  return omit(newData, readOnlyAttrs);
};


module.exports = {
  handleReadOnly,
};
