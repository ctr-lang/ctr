__Description__: User should be able to specify a lost grid `offset` using either the object or shorthand notation

Notation
- Object
```
offset: {
  fraction: <string || literal>
  gutter: <string || literal --> default: 30px>
  direction: <string -- row|column -- default: 'row'>
}
```
- Shorthand
```
offset: <fraction> <direction> <gutter>
```

__Notes__

- Lost test description: moves element down
    + https://github.com/peterramsing/lost/blob/master/test/lost-offset.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Margin to the left, right, bottom, or top, of an element depending on if the fraction passed is positive or negative. It works for both horizontal and vertical grids but not both.
    + `fraction` - Fraction of the container to be offset.
    + `row|column` - Direction the grid is going. Should be the opposite of the column or row it's being used on. Defaults to row.
    + `gutter` - How large the gutter involved is, typically this won't be adjusted, but if you have set the elements for that container to have different gutters than default, you will need to match that gutter here as well.