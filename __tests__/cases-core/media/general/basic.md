__Description__: To create a media query the user defines a `media` object and within the said object they define their CSS code to be affected by the media query. With the `media` object the user must also define a `query` object in which they will define their actual media query

Notation
```
media: {
  <CSS Prop>: <CSS Value>
  query: {
    <Query Prop>: <Query Value>
  }
}
```


__Notes__

- You must define a `query` otherwise it will throw an error
- By default the query will be naked: `@media (<prop>: <value>)` with a single query prop/value
- Regex: `/(^media$|^media-)/i`

