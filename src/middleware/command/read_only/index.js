'use strict';


const { omit } = require('lodash');


/**
 * Removes attributes marked in IDL as `readOnly`.
 * This is done silently (i.e. does not raise warnings or errors),
 * because readonly attributes can be part of a normal response, and clients
 * should be able to send responses back as is without having to remove
 * readonly attributes.
 **/
const handleReadOnly = function ({ idl, startupLog }) {
  const perf = startupLog.perf.start('command.handleReadOnly', 'middleware');
  const readOnlyMap = getReadOnlyMap({ idl });
  perf.stop();

  return async function handleReadOnly(input) {
    const { args, modelName, log } = input;
    const { data } = args;
    const perf = log.perf.start('command.handleReadOnly', 'middleware');

    // Remove readonly attributes in `args.data`
    if (data) {
      const readOnlyAttrs = readOnlyMap[modelName];
      args.data = data instanceof Array
        ? data.map(datum => omit(datum, readOnlyAttrs))
        : omit(data, readOnlyAttrs);
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
    .reduce((memo, obj) => Object.assign(memo, obj), {});
};


module.exports = {
  handleReadOnly,
};
