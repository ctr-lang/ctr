__Description__: If there is a `duration: <value>` key/value pair in the `option` object within a `transition` object then said `duration` value should be applied to the `transition-duration` across all properties in defined in the `transition` object

Notation
```
transition: {
  <...>: <...>
  option: {
    duration: <value>
  }
}
```