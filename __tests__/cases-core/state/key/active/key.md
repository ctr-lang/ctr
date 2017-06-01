__Description__: The user should be able to create a `active` `state` through the `active` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `active` properties

Notation
```
ctr({
  active: {
    <...>: {}
  }
})
```

__Notes__

- The `active` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^active$/i`