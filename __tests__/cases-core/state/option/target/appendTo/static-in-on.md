__Description__: If there is a `appendTo: <value>` key/value pair in the `option` object within a `on` `state` object in a `static` object then said `appendTo` value should appended to the scooped level at which it's declared in `<selector>:<state>`

__Notes__

- `appendTo` differs from `applyTo` in that there is no space in between the scooped level value and the `appendTo` value
    + `appendTo` -> `<.level><appendTo>`
    + `applyTo` -> `<.level> <applyTo>`