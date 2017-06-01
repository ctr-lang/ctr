__Description__: The user should be able to create a `disabled` `state` through the `disabled` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `disabled` properties

Notation
```
ctr({
  disabled: {
    <...>: {}
  }
})
```

__Notes__

- The `disabled` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^disabled$/i`