__Description__: Within a `state` a user should be able to define a `static` object which will apply the all defined properties within said object to both of the following CSS `<selector>:<state>` and `<selector>:not(:<state>)`. However, these `static` properties will not generate any transitions properties


Notation
```
ctr({
  <state>: {
    static: {
      <...>: <...>
    }
  }
})
```

__Notes__

- I can only assume the CSS folk who reside high in ivory towers would frown upon this. You should really just put `static` properties in the root of the current selector object