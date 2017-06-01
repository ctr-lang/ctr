__Description__: If the user defines a `animation` object it should generate animation properties for the scoped level and generate a `@keyframes` for animation as well if a `timeline` object is specified.

Notation
```
ctr({
  animation: {
    name: <animation name>
    timeline: {
      '<frame>': {
        <...>: <...>
      }
    }
  }
})
```

__Notes__

* Key of the object can either be `anim` or `animation`.
* The only required property is the `name` which corresponds with the `animation-name` and `keyframes` name.
* The timeline for the animation is created via a `timeline` or `tl` object and the keys of that object will represent the `keyframes`. 
    + These keys can be represented via the `number-percent` notation or the `to-from` notation. If using number and there is no `%` including it will add the `%` for you.
* The properties generate for the animation will correspond to the defaults unless specified otherwise in the `option` object.
    - The set defaults
        + `animation-delay: 0s;`
        + `animation-duration: 0.5s;`
        + `animation-fill-mode: none;`
        + `animation-direction: normal;`
        + `animation-iteration-count: 1;`
        + `animation-play-state: running;`
        + `animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);`

* Regex: `/(^anim$|^animation$|^anim-|^animation-)/i`
