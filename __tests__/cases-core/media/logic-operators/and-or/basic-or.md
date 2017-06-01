__Description__: The user should be able to specify a `or` condition using the `orCondition` object within the `query` object. The prop key/value paris will be combined via a `,` aka the `or` operator

Notation
```
ctr({
  query: {
    orCondition: {
      <...>: <...>
    }
  }
})
```

__Notes__

- Alias: `orCondition`, `orCond`