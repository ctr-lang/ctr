__Description__: `ctrSetVariable` can be used multiple times and every time you set it those vars are merged with one another

__Notes__

+ There are supposed to be `$var-not-found$`, not a bug, since they are not set yet
+ `ctrSetVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`