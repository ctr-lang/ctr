__Description__: To create a attribute selector the user defines an `attribute` object and within said object defines an attribute target via a key/value pair of `key: <attribute>`

Notation
```
ctr({
  attribute: {
    key: '<arrribute>'
    <...>: <...>
  }
})

```

__Notes__

+ The `attribute` object is being defined within a attribute `component` since attribute selectors target attributes
+ Regex: `/(^attr$|^attribute$|^attributes$|^attr-|^attribute-|^customAttr)/i`