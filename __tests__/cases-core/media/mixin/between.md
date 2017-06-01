__Description__: The `between: <value1> <value2>` mixin should create a `(min-width: <value1>) and (max-width: <value2>)` media query

Notation
Object
```
ctr({
  media: {
    query: {
      mixin: {
        between: <value1> <value2>
      }
    }
  }
})
```
Shorthand
```
ctr({
  media: {
    query: {
      between: <value1> <value2>
    }
  }
})
```


__Notes__

- Adapted from: https://github.com/jenius/rupture