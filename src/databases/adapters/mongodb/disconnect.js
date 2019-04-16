// Stops connection
export const disconnect = function({ connection: db }) {
  return db.close()
}
