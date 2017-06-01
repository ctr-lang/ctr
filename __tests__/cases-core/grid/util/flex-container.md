__Description__: User should be able to make both a `column` and `row` lost flex containter

- Notation
```
containter: <'column' || 'row' || true === 'column'>
```

__Notes__

- Lost test description:
    + flex for row
    + flex for column
    + https://github.com/peterramsing/lost/blob/master/test/lost-flex-container.js

Lost Docs
- Lost description: Creates a Flexbox container.
    + `row|column` - The flex-direction the container should create. This is typically opposite to the element you're creating so a row would need `lost-flex-container: column;`