__Description__: The user should be able to create a `hover` `state` through the hyphenated key notaiton: `hover-<state>: {}`

Notation
```
ctr({
  hover-on: {}
  hover-non: {}
})
```

__Notes__

- The `hover` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^hover-/i`