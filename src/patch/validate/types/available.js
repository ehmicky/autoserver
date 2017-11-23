'use strict';

// Available types in `patchOp.attribute|argument`
const TYPES = {
  null: {
    test: val => val == null,
    name: 'null',
    pluralname: 'null',
  },

  string: {
    test: val => typeof val === 'string',
    name: 'a string',
    pluralname: 'strings',
  },

  boolean: {
    test: val => typeof val === 'boolean',
    name: 'true or false',
    pluralname: 'true or false',
  },

  integer: {
    test: val => Number.isInteger(val),
    name: 'an integer',
    pluralname: 'integers',
  },

  number: {
    test: val => Number.isFinite(val),
    name: 'a number',
    pluralname: 'numbers',
  },

  object: {
    test: val => typeof val === 'object',
    name: 'an object',
    pluralname: 'objects',
  },
};

module.exports = {
  TYPES,
};
