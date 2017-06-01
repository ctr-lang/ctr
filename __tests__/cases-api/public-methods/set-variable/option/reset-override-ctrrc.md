__Description__: If vars present and there is a second arg of `{reset: true}` it should reset the var by deepmerging with the `ctrrc` option, which means you can overrie the rc value, and also reset it again to get back to rc

__Notes__

+ `setVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`