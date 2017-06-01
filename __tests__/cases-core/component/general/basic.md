__Description__: A `component` is defined as an element whose parent is the previous scope. To create a `component` a user defines an object that has a key of `component`. Using this declarative syntax the user also must define the componets selector through a `key: <component>` key/value pair either in the root of the `component` object or within the `option` object of said `component`. The default selector will be a `>` although this can easily be changed via the `option.selector` property.

Notation
```
ctr({
  component: {
    <...>: <...>
  }
})
```

__Notes__

- Component examples
    + `.test > span`
    + `.test > #id`
    + `.test > .class`
- The `key` also has the alias of `component` but I will be phasing this out due to possible confusion
- Regex: `/(^comp$|^component$|^components$|^comp-|^component-|^customComp)/i`
