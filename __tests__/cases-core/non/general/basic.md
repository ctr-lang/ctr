__Description__: To create a `not` selector the user defines an `non` object and within said object defines an `not` selector target via a key/value pair of `key: <selector>`

Notation
```
ctr({
  non: {
    key: '<selector>'
    <...>: <...>
  }
})

```

__Notes__

- If you would like you can use the `'not'` key as demonstrated in the test, although, it must be a string otherwise it will throw a nasty Stylus error since `not` is a special reserved Stylus keyword
- Regex: `/(^not$|^non$|^nons$|^not-|^non-)/i,`