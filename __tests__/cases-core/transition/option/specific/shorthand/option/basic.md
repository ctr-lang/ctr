__Description__: Within a `transition` object a user should be able to define a `shorthand` object to control the specificity for each properties transition. At the same time the user should also be able to define default `option`'s and within their `shorthand` use the keyword `default` to then inherit the set default properties that are set either loacally or gloablly

Notation
```
shorthand: {
  <prop>: <duration> <ease> <delay>
}
```

__Notes__

+ There is no need for you to specify all three `shorthand` values and if you omit any it will just inherit the default set value
+ `shorthand` does not have to be defined in the `option` object and can be defined in the root
