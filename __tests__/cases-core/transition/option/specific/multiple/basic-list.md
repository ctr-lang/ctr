__Description__: If there are multiple values for the `option` key/pairs values then those options should be applied in chronological order in relationship to the properties defined within the `transition` object

Notation
```
transition: {
  <prop1>: <value>
  <prop2>: <value>
  <prop3>: <value>
  option: {
    <option key>: <prop1> <prop2> <prop3>
  }
}
```

__Notes__

+ Not sure how I feel about this feature mulling it over
+ Works with `state` as well
+ If there is no value defined it will just use the `default` value