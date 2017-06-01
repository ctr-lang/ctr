__Description__: The user should be able to create a `enabled` `state` through the hyphenated key notaiton: `enabled-<state>: {}`

Notation
```
ctr({
  enabled-on: {}
  enabled-non: {}
})
```

__Notes__

- The `enabled` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^enabled-/i`