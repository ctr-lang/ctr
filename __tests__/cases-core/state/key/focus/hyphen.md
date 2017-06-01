__Description__: The user should be able to create a `focus` `state` through the hyphenated key notaiton: `focus-<state>: {}`

Notation
```
ctr({
  focus-on: {}
  focus-non: {}
})
```

__Notes__

- The `focus` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^focus-/i`