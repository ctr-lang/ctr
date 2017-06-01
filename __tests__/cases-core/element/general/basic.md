__Description__: An `element` is defined as any type of pseudo element or class that is not a state class such as `hover`, `active`, `focus`, etc. To create an `element` a user defines an object with the key of `element`. Using this declarative syntax the user also must define the type of pseudo element or class through a `key: <element>` key/value pair either in the root of the `element` object or within the `option` object of said `element`.

Notation
```
ctr({
  element: {
    <...>: <...>
  }
})
```

__Notes__

- Element examples
    + `.test::before`
    + `.test::after`
    + `.test:first-child`
    + `.test:only-of-type`
- As noted above state elements such as `hover` are considered to be `state` elements
- By default the colons will conform to the recommend practive of `:` and `::` depending on the pseudo element, although, this can be altered via the `option.colon` property
- Regex: `/(^elm$|^element$|^elm-|^element-|^customElm|^before$|^after$|-child$|-child\(\d+\)$|-type$|-type\(\d+\)$)/i`