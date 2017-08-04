# Settings

Clients can specify settings, which are ways to modify a whole request,
including any nested action.

There are several ways to specify them, e.g. the settings `My-Settings` could
be specified:
  - in HTTP headers, e.g. `X-Api-Engine-My-Settings: value`
  - in the URL query string, e.g. `?settings.mySettings=value`.
    Note that no dash will be used then, and the case will be different.
  - some settings have HTTP-specific additional ways to be setup,
    usually through standard HTTP headers.
    But the other ways of specifying are still available.

# Silent output

The settings `No-Output` will force the server to return an empty response.
The database will still be modified.

This defaults to `true` for the `delete` action, `false` otherwise.

This can also be set using the standard HTTP header `Prefer: return=minimal`.

# Dry runs

When using the settings `Dry-Run`, no modification will be applied to the
database, but the return value will be the same as if it did.

This defaults to `false`.
