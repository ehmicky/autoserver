'use strict';

const ACTIONS = [
  {
    name: 'findOne',
    type: 'find',
    multiple: false,
    commandNames: ['readOne'],
  },
  {
    name: 'findMany',
    type: 'find',
    multiple: true,
    commandNames: ['readMany'],
  },
  {
    name: 'createOne',
    type: 'create',
    multiple: false,
    commandNames: ['createOne'],
  },
  {
    name: 'createMany',
    type: 'create',
    multiple: true,
    commandNames: ['createMany'],
  },
  {
    name: 'replaceOne',
    type: 'replace',
    multiple: false,
    commandNames: ['updateOne'],
  },
  {
    name: 'replaceMany',
    type: 'replace',
    multiple: true,
    commandNames: ['updateMany'],
  },
  {
    name: 'updateOne',
    type: 'update',
    multiple: false,
    commandNames: ['readOne', 'updateOne'],
  },
  {
    name: 'updateMany',
    type: 'update',
    multiple: true,
    commandNames: ['readMany', 'updateMany'],
  },
  {
    name: 'upsertOne',
    type: 'upsert',
    multiple: false,
    commandNames: ['readOne', 'createOne', 'updateOne'],
  },
  {
    name: 'upsertMany',
    type: 'upsert',
    multiple: true,
    commandNames: ['readMany', 'createMany', 'updateMany'],
  },
  {
    name: 'deleteOne',
    type: 'delete',
    multiple: false,
    commandNames: ['deleteOne'],
  },
  {
    name: 'deleteMany',
    type: 'delete',
    multiple: true,
    commandNames: ['deleteMany'],
  },
];

module.exports = {
  ACTIONS,
};
