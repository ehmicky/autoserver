'use strict';

const { config, uncompiledIdl } = require('../shared');

const options = [
  config,

  uncompiledIdl,
];

const compileOptions = {
  options,
  name: 'compile',
  description: 'Compile the IDL file',
  examples: [
    ['Compile the IDL file', '--idl path_to_idl_file'],
  ],
};

module.exports = {
  ...compileOptions,
};
