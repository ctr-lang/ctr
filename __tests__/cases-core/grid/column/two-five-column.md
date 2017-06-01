__Description__: User should be able to create a lost grid `column` using either the object or shorthand notation

Notation
- Object
```
column: {
  fraction: <string || literal>
  gutter: <string || literal --> default: 30px>
  cycle: <string || literal -- default: fraction denominator>
  flex: <boolean -- string || literal -- default: true>
  none: <boolean -- string || literal -- default: false>
}
```
- Shorthand
```
column: <fraction> <cycle> <gutter> <flex>
column: <none>
```

__Notes__

- Lost test description: provides 2/5 column layout
    + https://github.com/peterramsing/lost/blob/master/test/lost-column.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Creates a column that is a fraction of the size of its containing element's width with a gutter.
    + `fraction` - This is a simple fraction of the containing element's width.
    + `gutter` - The margin on the right side of the element used to create a gutter. Typically this is left alone and settings.gutter will be used, but you can override it here if you want certain elements to have a particularly large or small gutter (pass 0 for no gutter at all).
    + `cycle` - Lost works by assigning a margin-right to all elements except the last in the row. It does this by default by using the denominator of the fraction you pick. To override the default use this param., e.g.: .foo { lost-column: 2/4 2; }
    + `flex|no-flex` - Determines whether this element should use Flexbox or not.
    + `none` - Resets the column (back to browser defaults)