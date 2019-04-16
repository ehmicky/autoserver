const getMessage = function({ plugin }) {
  if (plugin === undefined) {
    return
  }

  return `In the plugin '${plugin}'`
}

// Extra:
//  - plugin `{string}`
export const PLUGIN = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific plugin',
  getMessage,
}
