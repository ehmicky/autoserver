'use strict';


const { omit } = require('../../utilities');


/**
 * Removes attributes marked in IDL as `readOnly`.
 * This is done silently (i.e. does not raise warnings or errors),
 * because readonly attributes can be part of a normal response, and clients
 * should be able to send responses back as is without having to remove
 * readonly attributes.
 **/
const handleReadOnly = async function (input) {
  const { args, modelName, log, idl: { shortcuts: { readOnlyMap } } } = input;
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

const removeReadOnly = function ({ newData, readOnlyAttrs }) {
  // Value should be an object if valid, but it might be invalid
  // since the validation layer is not fired yet on input
  if (!newData || newData.constructor !== Object) { return newData; }

  return omit(newData, readOnlyAttrs);
};


module.exports = {
  handleReadOnly,
};
