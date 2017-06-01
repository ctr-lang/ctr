__Description__: `setVariable` sets vars that can be ref'ed via a string with `$<var>$`. `setVariable` is used primarly in YAML and not in JS since in JS you can pass around and require objects and shit. While I'm not sure if I need to say this, by no means am I telling you not to use this in JS, I can def see use cases

__Notes__

+ `setVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false})`
+ Alternative syntax: `setVar`