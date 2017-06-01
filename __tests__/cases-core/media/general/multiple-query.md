__Description__: The user should be able to define multiple key/value pairs within the `query` object and those queries should be composed and combined via the `and` media query key

Notation
```
media: {
  <CSS Prop>: <CSS Value>
  query: {
    <Query Prop>: <Query Value>
    <Query Prop>: <Query Value>
  }
}
```


__Notes__

- The default condition connector is `and` but an `or` condition can be created via a `orCond` object
