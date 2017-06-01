__Description__: Animation should be able to make use of the `shorthand` notation. In `shorthand` notation the `key` is used as the `animation-name` and `timeline` if one is presented.

__Notes__

+ The order of the shorthand notation properties are as follows
    * Object key will represent the `animation-name`
        1. `animation-duration`
        2. `animation-timing-function`
        3. `animation-delay`
        4. `animation-iteration-count`
        5. `animation-direction`
        6. `animation-fill-mode`
        7. `animation-play-state`
    * `<name>: <duration> <ease> <delay> <count> <dir> <mode> <state>`
+ Any shorthand property that is represented via the `default` key and or is omitted will default to the specified animation default value.
+ The `shorthand` object can either be in the root of the `animation` object or within the `option` object of the `animation` object
