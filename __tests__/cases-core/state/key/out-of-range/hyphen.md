__Description__: The user should be able to create a `out-of-range` `state` through the hyphenated key notaiton: `out-of-range-<state>: {}`

Notation
```
ctr({
  out-of-range-on: {}
  out-of-range-non: {}
})
```

__Notes__

- The `out-of-range` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^out-of-range-/i`