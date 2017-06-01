__Description__: The user should be able to create a `disabled` `state` through the hyphenated key notaiton: `disabled-<state>: {}`

Notation
```
ctr({
  disabled-on: {}
  disabled-non: {}
})
```

__Notes__

- The `disabled` `state` transition will automatically be generated if you wish to override this feature use the `omit` option
- While the `common` and `static` hyphen keys also work it would be pointless to use them since each hyphenated key/value pair are treated as separate entities
- Regex: `/^disabled-/i`