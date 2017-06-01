__Description__: If a second arg of `setOption` method is `{reset: true}` it should reset back to base and set the new options

__Notes__

+ `setOption(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`
+ IMPORTANT -> if any options are set in the `.ctrrc` they will not be reset by default since they are consided to be part of your "base". If you want to reset completely, you also need to pass `{ctrrc: false}` in the same object