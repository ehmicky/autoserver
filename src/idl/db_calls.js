'use strict';


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
  dbCalls,
};
