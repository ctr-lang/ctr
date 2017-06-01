__Description__: The user should be able to create a `invalid` `state` through the hyphenated key notaiton: `invalid-<state>: {}`

Notation
```
ctr({
  invalid-on: {}
  invalid-non: {}
})
```

__Notes__

- The `invalid` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^invalid-/i`