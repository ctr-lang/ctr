__Description__: This test is exactly the same as the `element/general/basic` test although it uses the abbreviated key of `elm`

__Notes__

- Element examples
    + `.test::before`
    + `.test::after`
    + `.test:first-child`
    + `.test:only-of-type`
- As noted above state elements such as `hover` are considered to be `state` elements
- By default the colons will conform to the recommend practive of `:` and `::` depending on the pseudo element, although, this can be altered via the `option.colon` property
- Regex: `/(^elm$|^element$|^elm-|^element-|^customElm|^before$|^after$|-child$|-child\(\d+\)$|-type$|-type\(\d+\)$)/i`