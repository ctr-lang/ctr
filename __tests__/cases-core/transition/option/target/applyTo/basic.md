__Description__: If there is a `applyTo: <value>` key/value pair in the `option` object within a `transition` object then said `applyTo` value should be applied to the scooped level at which it's declared

__Notes__

- `applyTo` differs from `appendTo` in that there is a space in between the scooped level value and the `applyTo` value
    + `applyTo` -> `<.level> <applyTo>`
    + `appendTo` -> `<.level><appendTo>`