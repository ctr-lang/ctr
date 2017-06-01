__Description__: If there is a `property` key/value list pair defined in the `option` object and multiple values for `option` key/pairs then the defined values should correspond with the index position of the listed properties

Notation
```
transition: {
  <...>: <...>
  option: {
    property: <prop1> <prop2> <prop3>
    <option key>: <prop1> <prop2> <prop3>
  }
}
```

__Notes__

+ Not sure how I feel about this feature mulling it over
+ There will be no auto-generation of transitions, ex: `border-width` in the test there is no `transition` generated for it
+ Works with `state` as well
+ If there is no value defined it will just use the `default` value
