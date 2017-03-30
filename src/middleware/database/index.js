'use strict';


/**
 * Summary of arguments:
 *  - {any|any[]} id|ids     - Filter the operation by id
 *                             For createOne:
 *                              - it is the id the newly created instance
 *                              - it is optional, unless there is another nested operation on a submodel
 *                             Operations on submodels will automatically get filtered by id.
 *                             If an id is then specified, both filters will be used
 *  - {object|object[]} data - Attributes to update or create
 *                             Is an array with createMany, replaceMany or upsertMany
 *  - {any} filter           - Filter the operation by a specific attribute.
 *                             The argument name is that attribute name, not `filter`
 *  - {string} order_by      - Sort results.
 *                             Value is attribute name, followed by optional + or - for ascending|descending order (default: +)
 *
 * Summary of operations:
 *   findOne(id)
 *   findMany([filter...])
 *   deleteOne(id)
 *   deleteMany([filter...])
 *   updateOne(data, id)
 *   updateMany(data[, filter...])
 *   createOne(data[, id])
 *   createMany(data[][, ids])
 *   replaceOne(data, id)
 *   replaceMany(data[], ids)
 *   upsertOne(data, id)
 *   upsertMany(data[], ids)
 **/


const queryDatabase = async function () {
  return async function (input) {
    const { operation, args } = input;
    // Fake data for the moment
    let response;
    console.log(JSON.stringify(input));
    if (operation.endsWith('Many')) {
      response = await [
        { id: 1, weight: 1.5, isOverweight: false, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy', attributes: { age: 10 }, best_friend: 1, friends: [1, 2, 3] },
        { id: 2, weight: 2.5, isOverweight: true, name: 'Cat', photo_urls: ['http://cat.com/photo/1', 'http://cat.com/photo/2'], tags: ['even more adorable'], status: 'grumpy', attributes: { age: 12 }, best_friend: 1, friends: [1, 2, 3] },
        { id: 3, weight: 3.5, isOverweight: true, name: 'Koala', photo_urls: ['http://koala.com/photo/1'], tags: ['suspended'], status: 'sleepy', attributes: { age: 14 }, best_friend: 1, friends: [1, 2, 3] },
      ];
    } else {
      response = await { id: 1, weight: 1.5, isOverweight: false, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy', attributes: { age: 10 }, best_friend: 1, friends: [1, 2, 3] };
    }
    return response;
  };
};


module.exports = {
  queryDatabase,
};