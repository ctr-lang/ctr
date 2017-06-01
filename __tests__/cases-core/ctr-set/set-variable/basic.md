__Description__: `ctrSetVariable` sets vars that can be ref'ed via a string with `$<var>$`. Two args the Stylus Object with the vars you want to set an optional option Object

__Notes__

+ Wheater this makes sense to do in Stylus is questionable, I can see it, I'm not sure I would recomend it though
+ The action is exsactly the same as the JS method `ctr.setVariable`
+ `ctrSetVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`
+ alais: `$$({})`