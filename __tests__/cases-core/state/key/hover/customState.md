__Description__: The user should be able to create a `hover` `state` through the use of the `customState` object key notation. However, the user must then define a `key` key/value pair to define the `state` in either the root of the object of within the `option` object. The use should also be able to use `on`, `non`, `common`, `static` objects within their `customState` object

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

- `key` has an alias of `state`
- The `hover` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- Regex `/^customSt/i`
