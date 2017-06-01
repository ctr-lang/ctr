__Description__: If the media key matched the `media-+` then its equivalant to a `above: <object key>` mixin.

Notation
```
ctr({
  media-+<scale measure>: {
    <...>: <...>
  }
})
```

__Notes__

+ __Important__ need to wrap in string due to stylus parser
+ Default Scale specified in global options
    + `xs: 400px`
    + `sm: 600px`
    + `md: 800px`
    + `lg: 1050px`
    + `hd: 1800px`
