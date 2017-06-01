__Description__: The user should be able to create a `in-range` `state` through the `in-range` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `in-range` properties

Notation
```
ctr({
  in-range: {
    <...>: {}
  }
})
```

__Notes__

- The `in-range` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^in-range$/i`