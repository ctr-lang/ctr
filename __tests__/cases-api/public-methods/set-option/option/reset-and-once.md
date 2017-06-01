__Description__: Should be able to use the `reset` and `once` option together

__Notes__

+ options in `rc` if any will be merged into the reset -> if you don't want this you have to set `{ctrrc: false}`
+ + `setOption(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`