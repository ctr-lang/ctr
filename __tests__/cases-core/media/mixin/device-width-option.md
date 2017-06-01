__Description__: The `device: true` mixin option will prefix for `device` check the __Notes__
 to see the props it works with

Notation
```
ctr({
  media: {
    query: {
      mixin: {
        max-width: 300px
        device: true
      }
    }
  }
})
```

Notes
- Only works with the following props
    + `min-width`
    + `max-width`
    + `min-height`
    + `max-height`
Notes
- Adapted from: https://github.com/jenius/rupture