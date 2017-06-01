__Description__: User should be able to make a lost waffle grid using either the object or shorthand notation

Notation
- Object
```
waffle: {
  fraction: <string || literal>
  gutter: <string || literal -- default: 30px>
  cycle: <string || literal -- default: fraction denominator>
  flex: <boolean -- string || literal -- default: true>
}
```
- Shorthand
```
waffle: <fraction> <cycle> <gutter> <flex>
```

__Notes__

- Lost test description: supports a custom cycle
    + https://github.com/peterramsing/lost/blob/master/test/lost-waffle.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Creates a block that is a fraction of the size of its containing element's width AND height with a gutter on the right and bottom.
    + `fraction` - This is a simple fraction of the containing element's width and height.
    + `cycle` - Lost works by assigning a margin-right/bottom to all elements except the last row (no margin-bottom) and the last column (no margin-right). It does this by default by using the denominator of the fraction you pick.
    + `gutter` - The margin on the right and bottom side of the element used to create a gutter. Typically this is left alone and the global $gutter will be used, but you can override it here if you want certain elements to have a particularly large or small gutter (pass 0 for no gutter at all).
    + `flex|no-flex` - Determines whether this element should use Flexbox or not.