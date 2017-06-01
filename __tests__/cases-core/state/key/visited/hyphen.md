__Description__: The user should be able to create a `visited` `state` through the hyphenated key notaiton: `visited-<state>: {}`

Notation
```
ctr({
  visited-on: {}
  visited-non: {}
})
```

__Notes__

- A `visited` `state` transition will not be automatically be generated since it's not a common practice, however, to override this setting you can do so via the `omit: false` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^visited-/i`