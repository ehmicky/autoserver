'use strict';

const ACTIONS = [
  { name: 'findOne', type: 'find', multiple: false },
  { name: 'findMany', type: 'find', multiple: true },
  { name: 'createOne', type: 'create', multiple: false },
  { name: 'createMany', type: 'create', multiple: true },
  { name: 'replaceOne', type: 'replace', multiple: false },
  { name: 'replaceMany', type: 'replace', multiple: true },
  { name: 'updateOne', type: 'update', multiple: false },
  { name: 'updateMany', type: 'update', multiple: true },
  { name: 'upsertOne', type: 'upsert', multiple: false },
  { name: 'upsertMany', type: 'upsert', multiple: true },
  { name: 'deleteOne', type: 'delete', multiple: false },
  { name: 'deleteMany', type: 'delete', multiple: true },
];

module.exports = {
  ACTIONS,
};
