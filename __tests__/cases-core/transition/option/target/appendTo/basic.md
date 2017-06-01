__Description__: If there is a `appendTo: <value>` key/value pair in the `option` object within a `transition` object then said `appendTo` value should be appended to the scooped level at which it's declared

__Notes__

- `appendTo` differs from `applyTo` in that there is no space in between the scooped level value and the `appendTo` value
    + `appendTo` -> `<.level><appendTo>`
    + `applyTo` -> `<.level> <applyTo>`

