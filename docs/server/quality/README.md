# Software quality

Software quality is ensured in several ways:
  - every server [event](logging.md#events), including requests and errors, can
    be [logged](logging.md). Every log contains full
    [information](logging.md#functions-parameters) about the context.
  - performance can be [monitored](logging.md#performance-monitoring)
  - the API is [auto-documented](documentation.md) (as a GraphQL schema only
    for the moment)
  - client requests are constrained by [limits](limits.md) to guarantee a proper
    level of service
