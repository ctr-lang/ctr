__Description__: User should be able to create a lost gird `masonry-wrap` using either the object or shorthand notation

Notation
- Object
```
masonry-wrap: {
  flex: <boolean -- string || literal -- default: true>
  gutter: <string || literal --> default: 30px>
}
```
- Shorthand
```
masonry-wrap: <gutter> <flex>
```

__Notes__

- Lost test description: support a custom gutter
    + https://github.com/peterramsing/lost/blob/master/test/lost-masonry-wrap.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Creates a wrapping element for working with JS Masonry libraries like Isotope. Assigns a negative margin on each side of this wrapping element.
    + `flex|no-flex` - Determines whether this element should use Flexbox or not.
    + `gutter` - How large the gutter involved is, typically this won't be adjusted and will inherit settings.gutter, but it's made available if you want your masonry grid to have a special gutter, it should match your masonry-column's gutter.