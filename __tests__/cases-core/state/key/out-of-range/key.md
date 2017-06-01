__Description__: The user should be able to create a `out-of-range` `state` through the `out-of-range` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `out-of-range` properties

Notation
```
ctr({
  out-of-range: {
    <...>: {}
  }
})
```

__Notes__

- The `out-of-range` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^out-of-range$/i`