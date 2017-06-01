__Description__: The user should be able to create a `focus` `state` through the `focus` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `focus` properties

Notation
```
ctr({
  focus: {
    <...>: {}
  }
})
```

__Notes__

- The `focus` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^focus$/i`