__Description__: The user should be able to create a `optional` `state` through the `optional` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `optional` properties

Notation
```
ctr({
  optional: {
    <...>: {}
  }
})
```

__Notes__

- The `optional` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^optional$/i`