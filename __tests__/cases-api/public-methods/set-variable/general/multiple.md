__Description__: The `setVariable` can be used multiple times and every time you set it those vars are merged with one another

__Notes__

+ There are supposed to be `$var-not-found$`, not a bug, since they are not set yet
+ `setVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false})`