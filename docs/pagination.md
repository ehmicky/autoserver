# Cursor pagination

Plural commands are paginated by default.

The default pagination system is cursor-based. A plural command will return
batches as:

```json
{
  "data": [
    {
      "id": "1",
      "name": "Anthony",
      "__metadata": {
        "pages": {
          "has_prev_page": false,
          "has_next_page": true,
          "pagesize": 10,
          "token": "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlszLjUsIjMiXX0"
        }
      }
    },

    ...

    {
      "id": "10",
      "name": "Mary",
      "__metadata": {
        "pages": {
          "has_prev_page": true,
          "has_next_page": true,
          "pagesize": 10,
          "token": "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlsxLjUsIjEiXX0"
        }
      }
    },
  ]
}
```

The page size is determined by the server, but clients can increase it
(although servers can set a maximum), using:

```HTTP
GET /rest/users/?pagesize=20
```

To iterate through batches, take the last model's `token` and repeat the query,
using `after`, e.g.:

```HTTP
GET /rest/users/?after=eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlsxLjUsIjEiXX0
```

To iterate backward, use `before` instead of `after`, with the first model's
`token`.

Using an empty token `""` with `after` or `before` allows iterating from the
beginning or the end.

The first query (without `before` nor `after`) can specify `filter` or
`order`, but the next paginated queries cannot.

One can use `has_prev_page` and `has_next_page` in the response to know
when to stop iterating.

# Offset pagination

One can use an offset-based pagination, by using `page` (starting at 1), e.g.:

```HTTP
GET /rest/users/?pagesize=20&page=5
```

# Pagination limits

See [this page](limits.md).
