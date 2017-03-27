'use strict';


const queryDatabase = () => async function (input) {
  const { operation, args } = input;
  // Fake data for the moment
  let response;
	console.log(JSON.stringify(operation));
  if (operation.multiple) {
    response = await [
      { id: 1, weight: 1.5, isOverweight: false, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy', attributes: { age: 10 } },
      { id: 2, weight: 2.5, isOverweight: true, name: 'Cat', photo_urls: ['http://cat.com/photo/1', 'http://cat.com/photo/2'], tags: ['even more adorable'], status: 'grumpy', attributes: { age: 12 } },
      { id: 3, weight: 3.5, isOverweight: true, name: 'Koala', photo_urls: ['http://koala.com/photo/1'], tags: ['suspended'], status: 'sleepy', attributes: { age: 14 } },
    ];
  } else {
    response = await { id: 1, weight: 1.5, isOverweight: false, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy', attributes: { age: 10 } };
  }
  return response;
};


module.exports = {
  queryDatabase,
};