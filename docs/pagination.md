# Cursor pagination

Plural actions are paginated by default.

The default pagination system is cursor-based. A plural action will return
batches as:

```json
{
  "data": {
    "findUsers": [
      {
        "id": "1",
        "name": "Anthony",
        "__metadata": {
          "pages": {
            "has_previous_page": false,
            "has_next_page": true,
            "page_size": 10,
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
            "has_previous_page": true,
            "has_next_page": true,
            "page_size": 10,
            "token": "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlsxLjUsIjEiXX0"
          }
        }
      },
    ]
  }
}
```

The page size is determined by the server, but clients can increase it
(although servers can set a maximum), using:

```graphql
findUsers(page_size: 20)
```

To iterate through batches, take the last model's `token` and repeat the query,
using `after`, e.g.:

```graphql
findUsers(after: "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlsxLjUsIjEiXX0")
```

To iterate backward, use `before` instead of `after`, with the first model's
`token`.

Using an empty token `""` with `after` or `before` allows iterating from the
beginning or the end.

The first query (without `before` nor `after`) can specify `filter` or
`order_by`, but the next paginated queries cannot.

One can use `has_previous_page` and `has_next_page` in the response to know
when to stop iterating.

# Offset pagination

One can use an offset-based pagination, by using `page` (starting at 1), e.g.:

```graphql
findUsers(page_size: 20, page: 5)
```
