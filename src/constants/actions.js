'use strict';


const actions = [
  {
    name: 'findOne',
    actionType: 'find',
    multiple: false,
    commandNames: ['readOne'],
  },
  {
    name: 'findMany',
    actionType: 'find',
    multiple: true,
    commandNames: ['readMany'],
  },
  {
    name: 'createOne',
    actionType: 'create',
    multiple: false,
    commandNames: ['createOne'],
  },
  {
    name: 'createMany',
    actionType: 'create',
    multiple: true,
    commandNames: ['createMany'],
  },
  {
    name: 'replaceOne',
    actionType: 'replace',
    multiple: false,
    commandNames: ['updateOne'],
  },
  {
    name: 'replaceMany',
    actionType: 'replace',
    multiple: true,
    commandNames: ['updateMany'],
  },
  {
    name: 'updateOne',
    actionType: 'update',
    multiple: false,
    commandNames: ['readOne', 'updateOne'],
  },
  {
    name: 'updateMany',
    actionType: 'update',
    multiple: true,
    commandNames: ['readMany', 'updateMany'],
  },
  {
    name: 'upsertOne',
    actionType: 'upsert',
    multiple: false,
    commandNames: ['readOne', 'createOne', 'updateOne'],
  },
  {
    name: 'upsertMany',
    actionType: 'upsert',
    multiple: true,
    commandNames: ['readMany', 'createMany', 'updateMany'],
  },
  {
    name: 'deleteOne',
    actionType: 'delete',
    multiple: false,
    commandNames: ['deleteOne'],
  },
  {
    name: 'deleteMany',
    actionType: 'delete',
    multiple: true,
    commandNames: ['deleteMany'],
  },
];


module.exports = {
  actions,
};
