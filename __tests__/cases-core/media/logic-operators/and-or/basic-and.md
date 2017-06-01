__Description__: The user should be able to specify a `and` condition using the `andCondition` object within the `query` object. The prop key/value paris will be combined via a `and` aka the `and` operator

Notation
```
ctr({
  query: {
    andCondition: {
      <...>: <...>
    }
  }
})
```

__Notes__

- Alias: `andCondition`, `andCond`
- If no condition object is specified then condition defaults to `and`