__Description__: Within a `state` a user should be able to define an `non` object which will apply the all defined properties within said object to the following CSS `<selector>:not(:<state>)`. In plain English, when the `state` conditions are not (`non`) meet I want `x` to occur. 

Notation
```
ctr({
  <state>: {
    non: {
      <...>: <...>
    }
  }
})
```

__Notes__

- You must use the key `non` since `not` is a reserved stylus key
- `hover`, `focus`, and `active` will all generate transition properties for all the defined properties of your `non` object
- All the transition options can be modified through the `option` object, check out `state/option/specific`