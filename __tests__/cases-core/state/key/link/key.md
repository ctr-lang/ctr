__Description__: The user should be able to create a `link` `state` through the `link` key object notation and then within said object be able to define `on`, `non`, `common`, `static` objects to define the `link` properties

Notation
```
ctr({
  link: {
    <...>: {}
  }
})
```

__Notes__

- A `link` `state` transition will not be automatically be generated since it's not a common practice, however, to override this setting you can do so via the `omit: false` option
- Regex: `/^link$/i`