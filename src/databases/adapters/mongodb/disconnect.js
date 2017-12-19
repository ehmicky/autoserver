'use strict';

// Stops connection
const disconnect = function ({ connection: db }) {
  return db.close();
};

module.exports = {
  disconnect,
};
