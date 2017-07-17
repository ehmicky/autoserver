'use strict';


const checkObject = function (obj) {
  const isObject = obj && obj.constructor === Object;
  if (!isObject) {
    try {
      obj = JSON.stringify(obj);
    } catch (e) { /* */ }
    const message = `Utility must be used with objects: ${obj}`;
    throw new Error(message);
  }
};


module.exports = {
  checkObject,
};
