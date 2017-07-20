'use strict';

const { makeImmutable } = require('../utilities');

const COMMANDS = [
  { name: 'createOne', type: 'create', multiple: false },
  { name: 'createMany', type: 'create', multiple: true },
  { name: 'readOne', type: 'read', multiple: false },
  { name: 'readMany', type: 'read', multiple: true },
  { name: 'updateOne', type: 'update', multiple: false },
  { name: 'updateMany', type: 'update', multiple: true },
  { name: 'deleteOne', type: 'delete', multiple: false },
  { name: 'deleteMany', type: 'delete', multiple: true },
  { name: 'upsertOne', type: 'upsert', multiple: false },
  { name: 'upsertMany', type: 'upsert', multiple: true },
];
makeImmutable(COMMANDS);

module.exports = {
  COMMANDS,
};
