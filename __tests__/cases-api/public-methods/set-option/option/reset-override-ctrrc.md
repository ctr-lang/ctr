__Description__: If options present and there is a second arg of `{reset: true}` it should reset the options by deepmerging with the `ctrrc` option, which means you can overrie the rc value, and also reset it again to get back to rc

__Notes__

+ `setOption(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`
+ IMPORTANT -> if any options are set in the `.ctrrc` they will not be reset by default since they are consided to be part of your "base". If you want to reset completely, you also need to pass `{ctrrc: false}` in the same object