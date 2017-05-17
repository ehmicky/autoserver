'use strict';


const commands = [
  { name: 'createOne', type: 'create', multiple: false },
  { name: 'createMany', type: 'create', multiple: true },
  { name: 'readOne', type: 'read', multiple: false },
  { name: 'readMany', type: 'read', multiple: true },
  { name: 'updateOne', type: 'update', multiple: false },
  { name: 'updateMany', type: 'update', multiple: true },
  { name: 'deleteOne', type: 'delete', multiple: false },
  { name: 'deleteMany', type: 'delete', multiple: true },
];


module.exports = {
  commands,
};
