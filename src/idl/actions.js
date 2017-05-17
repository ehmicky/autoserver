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
  { name: 'createOne', generic: 'create', multiple: false },
  { name: 'createMany', generic: 'create', multiple: true },
  { name: 'readOne', generic: 'read', multiple: false },
  { name: 'readMany', generic: 'read', multiple: true },
  { name: 'updateOne', generic: 'update', multiple: false },
  { name: 'updateMany', generic: 'update', multiple: true },
  { name: 'deleteOne', generic: 'delete', multiple: false },
  { name: 'deleteMany', generic: 'delete', multiple: true },
];


module.exports = {
  actions,
  dbCalls,
};
