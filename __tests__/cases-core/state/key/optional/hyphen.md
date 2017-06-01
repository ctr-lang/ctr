__Description__: The user should be able to create a `optional` `state` through the hyphenated key notaiton: `optional-<state>: {}`

Notation
```
ctr({
  optional-on: {}
  optional-non: {}
})
```

__Notes__

- The `optional` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^optional-/i`