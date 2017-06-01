__Description__: The user should be able to create a `invalid` `state` through the `invalid` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `invalid` properties

Notation
```
ctr({
  invalid: {
    <...>: {}
  }
})
```

__Notes__

- The `invalid` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^invalid$/i`