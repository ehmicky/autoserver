'use strict';


/**
 * List of errors
 * Keys are the exception.reason of the exception thrown
 * Subkeys are either:
 *  - generic {object} - always applied
 *  - protocol.PROTOCOL {object} - applied if protocol is PROTOCOL
 *  - interface.INTERFACE {object} - applied if interface is INTERFACE
 *  - action.ACTION {object} - applied if action is ACTION
 * The most specific has priority, i.e. action > interface > protocol > generic
 * Values are merged to exceptions thrown
 *
 * TODO: add `url` property pointing towards API documentation for that error
 * TODO: add all `title` properties to `generic`
 */
const errorReasons = {

  // Tried to query a protocol that is not supported, e.g. UDP
  UNSUPPORTED_PROTOCOL: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // HTTP request body has a Content-Length but no request body
  HTTP_NO_CONTENT_TYPE: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // HTTP query string is wrong
  HTTP_QUERY_STRING_PARSE: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // Tried to query an interface that is not supported, e.g. SOAP
  UNSUPPORTED_INTERFACE: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // HTTP request is trying to perform a GraphQL query,
  // but does not specify the query
  GRAPHQL_NO_QUERY: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // GraphQL query syntax error, i.e. GraphQL crashed trying to parse
  // the raw query
  GRAPHQL_SYNTAX_ERROR: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // General validation input errors, e.g. input data|filter does not
  // match IDL schema
  INPUT_VALIDATION: {
    protocol: {
      http: { extra: { status: 400 } },
    },
  },

  // Standard 404, e.g. route not found
  NOT_FOUND: {
    protocol: {
      http: { extra: { status: 404 } },
    },
  },

  // A database model could not be found, e.g. incorrect id
  DATABASE_NOT_FOUND: {
    generic: {
      title: 'Model not found',
    },
    protocol: {
      http: { extra: { status: 404 } },
    },
  },

  // Command is not supported, or most likely not allowed for this model
  WRONG_COMMAND: {
    protocol: {
      http: { extra: { status: 405 } },
    },
  },

  // A command conflicts with another one,
  // e.g. tries to create already existing model
  DATABASE_MODEL_CONFLICT: {
    protocol: {
      http: { extra: { status: 409 } },
    },
  },

  // input is too big, e.g. arg.data has too many items
  INPUT_LIMIT: {
    protocol: {
      http: { extra: { status: 413 } },
    },
  },

  // HTTP request body Content-Type is unsupported
  HTTP_WRONG_CONTENT_TYPE: {
    protocol: {
      http: { extra: { status: 415 } },
    },
  },

  // Filesystem error: could not open local file
  FILE_OPEN_ERROR: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // HTTP query string is wrong, but was created by the server
  HTTP_QUERY_STRING_SERIALIZE: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // IDL definition is syntactically invalid
  IDL_SYNTAX_ERROR: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // IDL definition is semantically invalid
  IDL_VALIDATION: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // Main options have syntax errors
  OPTIONS_VALIDATION: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // IDL definition is invalid, for usage with GraphQL
  GRAPHQL_WRONG_DEFINITION: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // Introspection failed because of wrong schema
  GRAPHQL_WRONG_INTROSPECTION_SCHEMA: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // GraphiQL HTML templating failed
  GRAPHIQL_PARSING_ERROR: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // Request did not pass IDL validation, e.g. `args` was not provided,
  // indicating a server bug
  INPUT_SERVER_VALIDATION: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // Response did not pass IDL validation, e.g. if the database is corrupted
  // or new constraints were applied without being migrated
  OUTPUT_VALIDATION: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // No middleware was able to handle the response
  WRONG_RESPONSE: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // Some utility got some wrong input
  UTILITY_ERROR: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // Trying to throw an exception with the wrong signature
  WRONG_EXCEPTION: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // The reason type is unknown
  UNKNOWN_TYPE: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

  // General catch-all error
  UNKNOWN: {
    protocol: {
      http: { extra: { status: 500 } },
    },
  },

};

const getErrorReason = function ({ error }) {
  const reason = getReason({ error });
  return errorReasons[reason];
};

const getReason = function ({ error: { reason = 'UNKNOWN' } }) {
  if (!errorReasons[reason]) { return 'UNKNOWN_TYPE'; }
  return reason;
};


module.exports = {
  getErrorReason,
  getReason,
};
