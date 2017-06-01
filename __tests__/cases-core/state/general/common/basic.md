__Description__: Within a `state` a user should be able to define a `common` object which will apply the all defined properties within said object to both the following CSS `<selector>:<state>` and `<selector>:not(:<state>)`. 

Notation
```
ctr({
  <state>: {
    common: {
      <...>: <...>
    }
  }
})
```

__Notes__

- Common is meant to be used with `option` or `shorthand`