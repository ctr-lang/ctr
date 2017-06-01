__Description__: User should be able to use the lost grid `align` using either the object or shorthand notation

Notation
- Object
```
align: {
  location: <string>
  flex: <boolean -- string || literal -- default: true>
}
```
- Shorthand
```
align: <location> <flex>
```

__Notes__

- alias: `right`, `center-right`, `cr`
- Lost test description: aligns middle right
    + https://github.com/peterramsing/lost/blob/master/test/lost-align.js
- You can use the keyword `default` use the default value for any value in both the object and shorthand notation

Lost Docs
- Lost description: Align nested elements. Apply this to a parent container.
    + `reset|horizontal|vertical|top-left|top-center|top|top-right|middle-left|left|middle-center|center|middle-right|right|bottom-left|bottom-center|bottom|bottom-right` The position the nested element takes relative to the containing element.
    + `flex|no-flex` - Determines whether this element should use Flexbox or not.
