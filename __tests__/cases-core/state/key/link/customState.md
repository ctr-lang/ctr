__Description__: The user should be able to create a `link` `state` through the use of the `customState` object key notation. However, the user must then define a `key` key/value pair to define the `state` in either the root of the object of within the `option` object. The use should also be able to use `on`, `non`, `common`, `static` objects within their `customState` object

Notation
```
ctr({
  customState: {
    key: <state>
    <...>: {}
  }
})
```

__Notes__

- A `link` `state` transition will not be automatically be generated since it's not a common practice, however, to override this setting you can do so via the `omit: false` option
- `key` has an alias of `state`
- Regex `/^customSt/i`