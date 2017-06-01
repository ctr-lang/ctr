__Description__: The user should be able to create a `required` `state` through the `required` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `required` properties

Notation
```
ctr({
  required: {
    <...>: {}
  }
})
```

__Notes__

- The `required` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex: `/^required$/i`