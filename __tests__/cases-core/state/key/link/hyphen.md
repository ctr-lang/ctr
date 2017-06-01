__Description__: The user should be able to create a `link` `state` through the hyphenated key notaiton: `link-<state>: {}`

Notation
```
ctr({
  link-on: {}
  link-non: {}
})
```

__Notes__

- A `link` `state` transition will not be automatically be generated since it's not a common practice, however, to override this setting you can do so via the `omit: false` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^link-/i`