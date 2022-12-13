import mongodb from 'mongodb'

// Starts connection
export const connect = async ({
  options: { hostname, port, username, password, dbname, opts },
}) => {
  const host = getHost({ hostname, port })
  const auth = getAuth({ username, password })
  const url = `mongodb://${auth}${host}/${dbname}`

  const mongoClient = new mongodb.MongoClient()
  const db = await mongoClient.connect(url, opts)
  return db
}

// MongoDB can connect to several replicas or mongos at once
// which looks like: `HOST:PORT,HOST2:PORT2,...`
const getHost = ({ hostname, port }) => {
  const hostnameA = Array.isArray(hostname) ? hostname : [hostname]
  const portA = Array.isArray(port) ? port : [port]

  const { hostname: hostnameB, port: portB } = fixHostLength({
    hostname: hostnameA,
    port: portA,
  })

  return hostnameB
    .map((hostnameC, index) => `${hostnameC}:${portB[index]}`)
    .join(',')
}

const fixHostLength = ({ hostname, port }) => {
  if (hostname.length === port.length) {
    return { hostname, port }
  }

  if (hostname.length === 1) {
    return {
      hostname: Array.from({ length: port.length }, () => hostname),
      port,
    }
  }

  if (port.length === 1) {
    return {
      hostname,
      port: Array.from({ length: hostname.length }, () => port),
    }
  }

  throw new Error(
    "Invalid options: 'databases.mongodb.hostname' and 'databases.mongodb.port' must have the same number of items",
  )
}

// Retrieve `username:password@`
const getAuth = ({ username, password }) => {
  if (!username && !password) {
    return ''
  }

  validateAuth({ username, password })

  return `${username}:${password}@`
}

const validateAuth = ({ username, password }) => {
  if (!username) {
    throw new Error(
      "Invalid option 'databases.mongodb.password': 'databases.mongodb.username' must also be defined",
    )
  }

  if (!password) {
    throw new Error(
      "Invalid option 'databases.mongodb.username': 'databases.mongodb.password' must also be defined",
    )
  }
}
