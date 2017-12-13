# Formats

The same formats are supported for the
[configuration file](configuration.md#configuration-file) as for the
[client request payloads and the server responses](../../client/arguments/formats.md), except the following ones are
also available: [JavaScript](#javascript).

Most of the examples in this documentation use
[YAML](../../client/arguments/formats.md#yaml) for the
[configuration properties](configuration.md#properties).

# JavaScript

<!-- eslint-disable strict, filenames/match-exported, comma-dangle -->
```js
// Comment

const configuration = {
  limits: {
    pagesize: 10
  },
  protocols: {
    http: {
      hostname: 'myhostname'
    }
  }
};

module.exports = configuration;
```
