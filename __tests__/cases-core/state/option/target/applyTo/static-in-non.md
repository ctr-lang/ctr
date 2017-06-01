__Description__: If there is a `applyTo: <value>` key/value pair in the `option` object within a `non` `state` object in a `static` object then said `applyTo` value should applied to the scooped level at which it's declared in `<selector>:not(:<state>)`

__Notes__

- `applyTo` differs from `appendTo` in that there is a space in between the scooped level value and the `applyTo` value
    + `applyTo` -> `<.level> <applyTo>`
    + `appendTo` -> `<.level><appendTo>`