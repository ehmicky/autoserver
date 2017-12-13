# MongoDB options

The following options are available.

```yml
databases:
  mongodb:
    hostname: my_host
    port: 28000
    username: my_user
    password: my_password
    dbname: my_database_name
    opts:
      wtimeoutMS: 2000
```

  - `hostname`, `port` (defaults to `'localhost'` and `27017`): if you are
    targeting a cluster or a replica set, you must specify an array of hostnames
    and/or an array of ports.
  - `username`, `password`: optional authentication information
  - `dbname` (defaults to `data`): MongoDB database name
  - `opts`: extra options passed to the
    [MongoDB driver](http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/).
