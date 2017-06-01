__Description__: The user should be able to `merge` Stylus objects within `ctr` instances through the `merge` key/value pair

Notation
```
$obj = {
  <...>: <...>
}

ctr({
  merge: <$obj>
})
```

__Notes__

- `merge` is like a watered down version of `extend` and it's advantageous to use `extend` over `merge` although there are time when `merge` could be right medicine depending on the situation
