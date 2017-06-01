__Description__: User should be able to use the lost grid `move` using either the object or shorthand notation

Notation
- Object
```
move: {
  fraction: <string || literal>
  gutter: <string || literal --> default: 30px>
  direction: <string -- row|column -- default: 'row'>
}
```
- Shorthand
```
move: <fraction> <direction> <gutter>
```

__Notes__

- Lost test description: moves element down
    + https://github.com/peterramsing/lost/blob/master/test/lost-move.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Source ordering. Shift elements left, right, up, or down, by their left or top position by passing a positive or negative fraction.
    + `fraction` - Fraction of the container to be shifted.
    + `row|column` - Direction the grid is going. Should be the opposite of the column or row it's being used on.
    + `gutter` - Adjust the size of the gutter for this movement. Should match the element's gutter.