__Description__: The `density: <value>` mixin should create a `(min-resolution: <value>)` media query

Notation
Object
```
ctr({
  media: {
    query: {
      mixin: {
        density: <value>
      }
    }
  }
})
```
Shorthand
```
ctr({
  media: {
    query: {
      density: <value>
    }
  }
})
```


__Notes__

- Adapted from: https://github.com/jenius/rupture
- Like rupture except without all the prefixin since to make that work I would have to create some janky hack but then again you should be using a god damn prefix'er its 2016