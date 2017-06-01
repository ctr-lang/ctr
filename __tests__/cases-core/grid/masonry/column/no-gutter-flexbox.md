__Description__: User should be able to create a lost gird `masonry-column` using either the object or shorthand notation

Notation
- Object
```
masonry-column: {
  fraction: <string || literal -- default: 1/1>
  flex: <boolean -- string || literal -- default: true>
  gutter: <string || literal -- default: 30px>
}
```
- Shorthand
```
masonry-column: <fraction> <gutter> <flex>
```

__Notes__

- !important! There's conflicting code in the lost library in regards to what the `fraction` and `gutter` properties do and are. I'm going to pull a pr so cory can give me the down-low
- Lost test description: supports a no gutter with flexbox
    + https://github.com/peterramsing/lost/blob/master/test/lost-masonry-column.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Creates a wrapping element for working with JS Masonry libraries like Isotope. Assigns a negative margin on each side of this wrapping element.
    + `fraction` - This is a simple fraction of the containing element's width.
    + `gutter` - How large the gutter involved is, typically this won't be adjusted and will inherit settings.gutter, but it's made available if you want your masonry grid to have a special gutter, it should match your masonry-row's gutter.
    + `flex|no-flex` - Determines whether this element should use Flexbox or not.