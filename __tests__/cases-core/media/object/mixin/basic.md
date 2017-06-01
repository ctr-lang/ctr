__Description__: If the `media` object is composed of children objects then assume the user is using the object key notation. The intent for this notation is to allow the user to use the scale measures defined in global options. If the object key corresponds with a pre-defined scale measure it is equivalent to a `at: <obj key>` mixin. If the object key does not correspond with a scale measure then the user must define a `query`. Furthermore, if the object key does match a scale measure and also has a `query` object it will be combined via an `and` condition

Notation
```
ctr({
  media: {
    '<scale measure>': {
      <...>: <...>
    }
  }
})
```

__Notes__

- Default Scale specified in global options
    + `xs: 400px`
    + `sm: 600px`
    + `md: 800px`
    + `lg: 1050px`
    + `hd: 1800px`
