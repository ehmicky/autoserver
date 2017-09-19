# Settings

Clients can specify settings, which are ways to modify a whole request,
including any nested action.

There are several ways to specify them, e.g. the settings `mysettings` could
be specified:
  - in HTTP headers, e.g. `X-Api-Engine-Mysettings: value`
  - in the URL query string, e.g. `?settings.mysettings=value` or
    `?settings.mysettings` (the later uses default value `true`).
  - some settings have HTTP-specific additional ways to be setup,
    usually through standard HTTP headers.
    But the other ways of specifying are still available.

# Silent output

The settings `silent` will force the server to return an empty response.
The database will still be modified.

This can also be set using the standard HTTP header `Prefer: return=minimal`.

# Dry runs

When using the settings `dryrun`, no modification will be applied to the
database, but the return value will be the same as if it did.
