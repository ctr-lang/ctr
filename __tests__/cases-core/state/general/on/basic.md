__Description__: Within a `state` a user should be able to define an `on` object which will apply the all defined properties within said object to the following CSS `<selector>:<state>`. In plain English, `on` the meet condition of said `state` I want `x` to occur. 

Notation
```
ctr({
  <state>: {
    on: {
      <...>: <...>
    }
  }
})
```

__Notes__

- `hover`, `focus`, and `active` will all generate transition properties for all the defined properties of your `on` object
- All the transition options can be modified through the `option` object, check out `state/option/specific`