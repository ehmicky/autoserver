'use strict';


const { getPromise } = require('../src/utilities');

const testPlugin = function ({ idl, opts: { exampleOption } }) {
  // Plugins can be async
  const promise = getPromise();
  process.nextTick(() => {
    idl['x-plugin-attr'] = exampleOption;
    promise.resolve(idl);
  });
  return promise;
};


module.exports = testPlugin;
