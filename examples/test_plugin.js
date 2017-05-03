'use strict';


const testPlugin = function ({ idl }) {
  idl['x-plugin-attr'] = 1;
  return idl;
};


module.exports = testPlugin;
