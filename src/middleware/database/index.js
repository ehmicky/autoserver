'use strict';


const queryDatabase = () => async function (input) {
  const { operation, args } = input;
  // Fake data for the moment
  let response;
  console.log(operation.name);
  if (operation.multiple) {
    response = await [
      { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' },
      { id: 2, name: 'Cat', photo_urls: ['http://cat.com/photo/1', 'http://cat.com/photo/2'], tags: ['even more adorable'], status: 'grumpy' },
      { id: 3, name: 'Koala', photo_urls: ['http://koala.com/photo/1'], tags: ['suspended'], status: 'sleepy' },
    ];
  } else {
    response = await { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' };
  }
  return response;
};


module.exports = {
  queryDatabase,
};