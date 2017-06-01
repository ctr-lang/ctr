__Description__: The user should be able to create a `hover` `state` through the `hover` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `hover` properties

Notation
```
ctr({
  hover: {
    <...>: {}
  }
})
```

__Notes__

- The `hover` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^hover$/i`