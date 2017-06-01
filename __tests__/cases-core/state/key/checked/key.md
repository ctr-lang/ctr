__Description__: The user should be able to create a `checked` `state` through the `checked` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `checked` properties

Notation
```
ctr({
  checked: {
    <...>: {}
  }
})
```

__Notes__

- The `checked` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^checked$/i`