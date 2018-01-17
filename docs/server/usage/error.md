# Exceptions

Exceptions contain the same properties as the `error` property of an
[error response](../../client/request/error.md#error-responses). They also
include a `details` property with a stack trace.

When an [instruction](README.md) fails, its promise is rejected with an
exception object.

When a client-side or server-side error occurs, an exception will be
[logged](../quality/logging.md) using the
[`error` parameter](../quality/logging.md#functions-parameters).
