__Description__: The user should be able to define the `type` condition of the media query using both object and shorthand notation and the resulting output should be `@media only <type>`

Notation
Object
```
media: {
  <CSS Prop>: <CSS Value>
  query: {
    type: {
      media: <string || literal>
    }
  }
}
```
Shorthand
```
media: {
  <CSS Prop>: <CSS Value>
  query: {
    type: <string || literal>
  }
}
```

