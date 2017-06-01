__Description__: If there is a `delay: <value>` key/value pair in the `option` object within a `transition` object then said `delay` value should be applied to the `transition-delay` across all properties in defined in the `transition` object

Notation
```
transition: {
  <...>: <...>
  option: {
    delay: <value>
  }
}
```