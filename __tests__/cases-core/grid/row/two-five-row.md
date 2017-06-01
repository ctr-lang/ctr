__Description__: User should be able to make a lost `row` grid using either the object or shorthand notation

Notation
- Object
```
row: {
  fraction: <string || literal>
  gutter: <string || literal -- default: 30px>
  flex: <boolean -- string || literal -- default: true>
}
```
- Shorthand
```
row: <fraction> <gutter> <flex>
```

__Notes__

- Lost test description: provides 2/5 row layout
    + https://github.com/peterramsing/lost/blob/master/test/lost-row.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Creates a row that is a fraction of the size of its containing element's height with a gutter.
    + `fraction` - This is a simple fraction of the containing element's height.
    + `gutter` - The margin on the bottom of the element used to create a gutter. Typically this is left alone and settings.gutter will be used, but you can override it here if you want certain elements to have a particularly large or small gutter (pass 0 for no gutter at all).
    + `flex|no-flex` - Determines whether this element should use Flexbox or not.