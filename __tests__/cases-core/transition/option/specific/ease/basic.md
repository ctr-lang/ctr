__Description__: If there is a `ease: <value>` key/value pair in the `option` object within a `transition` object then said `ease` value should be applied to the `transition-timing-function` across all properties in defined in the `transition` object

Notation
```
transition: {
  <...>: <...>
  option: {
    ease: <value>
  }
}
```