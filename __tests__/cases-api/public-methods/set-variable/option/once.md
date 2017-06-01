__Description__: Should be able to implement the vars just once through a second option of `{once: true}`. The vars will be set for just once set and then they will revet back to whatever they where before.


__Notes__

+ `setVariable` is used primarly in YAML and not in JS since in JS you can pass around and require objects and shit. I'm just testing the basic struc here, altough, while I'm not sure if I need to say this, by no means am I telling you not to use this in JS, I can def see use cases
+ `setVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false})`