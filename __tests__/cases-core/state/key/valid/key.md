__Description__: The user should be able to create a `valid` `state` through the `valid` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `valid` properties

Notation
```
ctr({
  valid: {
    <...>: {}
  }
})
```

__Notes__

- The `valid` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^valid$/i`