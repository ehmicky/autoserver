# Compression

If the query variable `?compress=COMPRESS` is present, the server response will
be compressed.

`COMPRESS` can be any supported compression algorithm among:
  - `identity`: means no compression is performed
  - `deflate` and `gzip`: most common compression algorithms, supported by
    most browsers

By default, no compression is performed.

The client must decompress the response, which most web clients do
automatically.

Only textual content is compressed. Binary content, including pictures and
video, is never compressed.
