# Response compression

If the query variable `?compress=RESPONSE_COMPRESSION` is present, the server's
response will be compressed.

`RESPONSE_COMPRESSION` can be:
  - `identity`: no compression is performed
  - `deflate` or `gzip`: common compression algorithms supported by most
    browsers

By default, no compression is performed.

Only textual content is compressed. Binary content, including pictures and
video, is never compressed.

# Request compression

It is possible to specify that the request payload is compressed by adding
a second compression algorithm to the `compress` query variable, i.e. by
using `?compress=RESPONSE_COMPRESSION,REQUEST_COMPRESSION`, for example
`?compress=gzip,gzip`.

Note that while most web clients (including browsers) automatically decompress
responses, almost none of them compress the request payload. This means,
in order to use request compression, the request payload must usually be
manually compressed by the client application before sending.
