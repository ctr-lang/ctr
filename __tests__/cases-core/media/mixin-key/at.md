__Description__: If the media key matched the `media-` then its equivalant to a `at: <object key>` mixin.

Notation
```
ctr({
  media-<scale measure>: {
    <...>: <...>
  }
})
```

__Notes__

+ __Important__ need to wrap in string due to stylus parser
+ Ran last so, no need to worry about conflicts
+ Default Scale specified in global options
    + `xs: 400px`
    + `sm: 600px`
    + `md: 800px`
    + `lg: 1050px`
    + `hd: 1800px`
