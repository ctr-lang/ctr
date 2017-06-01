__Description__: The user should be able to create a `enabled` `state` through the `enabled` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `enabled` properties

Notation
```
ctr({
  enabled: {
    <...>: {}
  }
})
```

__Notes__

- The `enabled` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^enabled$/i`