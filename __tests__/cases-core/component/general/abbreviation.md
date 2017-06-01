__Description__: This test is exactly the same as the `component/general/basic` test although it uses the abbreviated key of `comp`

__Notes__

- The default selector will be a `>` although this can easily be changed via the `option.selector` property.
- Component examples
    + `.test > span`
    + `.test > #id`
    + `.test > .class`
- The `key` also has the alias of `component` but I will be phasing this out due to possible confusion
- Regex: `/(^comp$|^component$|^components$|^comp-|^component-|^customComp)/i`