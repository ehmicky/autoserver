'use strict';


const actions = [
  {
    name: 'findOne',
    actionType: 'find',
    multiple: false,
    dbCalls: ['readOne'],
  },
  {
    name: 'findMany',
    actionType: 'find',
    multiple: true,
    dbCalls: ['readMany'],
  },
  {
    name: 'createOne',
    actionType: 'create',
    multiple: false,
    dbCalls: ['createOne'],
  },
  {
    name: 'createMany',
    actionType: 'create',
    multiple: true,
    dbCalls: ['createMany'],
  },
  {
    name: 'replaceOne',
    actionType: 'replace',
    multiple: false,
    dbCalls: ['updateOne'],
  },
  {
    name: 'replaceMany',
    actionType: 'replace',
    multiple: true,
    dbCalls: ['updateMany'],
  },
  {
    name: 'updateOne',
    actionType: 'update',
    multiple: false,
    dbCalls: ['readOne', 'updateOne'],
  },
  {
    name: 'updateMany',
    actionType: 'update',
    multiple: true,
    dbCalls: ['readMany', 'updateMany'],
  },
  {
    name: 'upsertOne',
    actionType: 'upsert',
    multiple: false,
    dbCalls: ['readOne', 'createOne', 'updateOne'],
  },
  {
    name: 'upsertMany',
    actionType: 'upsert',
    multiple: true,
    dbCalls: ['readMany', 'createMany', 'updateMany'],
  },
  {
    name: 'deleteOne',
    actionType: 'delete',
    multiple: false,
    dbCalls: ['deleteOne'],
  },
  {
    name: 'deleteMany',
    actionType: 'delete',
    multiple: true,
    dbCalls: ['deleteMany'],
  },
];

const dbCalls = [
  { name: 'createOne', multiple: false },
  { name: 'createMany', multiple: true },
  { name: 'readOne', multiple: false },
  { name: 'readMany', multiple: true },
  { name: 'updateOne', multiple: false },
  { name: 'updateMany', multiple: true },
  { name: 'deleteOne', multiple: false },
  { name: 'deleteMany', multiple: true },
];


module.exports = {
  actions,
  dbCalls,
};
