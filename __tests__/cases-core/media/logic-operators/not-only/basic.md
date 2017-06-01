__Description__: The user should be able to create a `not` media condition via the `type` object by specifying `condition: not`

Notation
```
ctr({
  media: {
    <...>: <...>
    query: {
      type: {
        media: <type>
        condition: <'not' || 'only'>
      }
    }
  }
})
```

__Notes__

- You must also specify a `media: <type>` for the `not` or `only` to target