__Description__: The user should be able to create a `visited` `state` through the `visited` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `visited` properties

Notation
```
ctr({
  visited: {
    <...>: {}
  }
})
```

__Notes__

- A `visited` `state` transition will not be automatically be generated since it's not a common practice, however, to override this setting you can do so via the `omit: false` option
- Regex: `/^visited$/i`