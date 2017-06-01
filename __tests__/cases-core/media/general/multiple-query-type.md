__Description__: The user should be able to define multiple `type` conditions the of media query using both object and shorthand notation and the resulting output should combine said types via `,` as follows: `@media only <type>, <type>, <...>`

Notation
Object
```
media: {
  <CSS Prop>: <CSS Value>
  query: {
    type: {
      media: <string || literal> <string || literal> <...>
    }
  }
}
```
Shorthand
```
media: {
  <CSS Prop>: <CSS Value>
  query: {
    type: <string || literal> <string || literal> <...>
  }
}
```
