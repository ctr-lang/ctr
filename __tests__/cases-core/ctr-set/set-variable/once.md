__Description__: Should be able to implement the vars just once through a second option of `{once: true}`. The vars will be set for just once set and then they will revet back to whatever they where before.


__Notes__

+ Its not outputting `$var-not-found$` since the var object is empty and as such its not checked
+ `ctrSetVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`