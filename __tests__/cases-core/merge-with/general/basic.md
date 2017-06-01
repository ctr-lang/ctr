__Description__: The user should be able to `mergeWith` local vars within `ctr` instances through the `mergeWith` key/value pair

Notation
```
ctr({
  $$: {
    obj: {
      <...>: <...>
    }
  }
  mergeWith: $$[<obj>]
})
```

__Notes__

+ `mergeWith` sytax is the same as `merge` 
    - The key diffrance is that `mergeWith` merges in the var including the key while `merge` only merges the value