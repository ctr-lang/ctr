__Description__: The user should be able to create a `in-range` `state` through the hyphenated key notaiton: `in-range-<state>: {}`

Notation
```
ctr({
  in-range-on: {}
  in-range-non: {}
})
```

__Notes__

- The `in-range` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^in-range-/i`