__Description__: Should get the last set of ctr styles

__Notes__

+ `getLastResult()`
+ Does not reset the result set unless specified
+ Here is the gist with this whole set buisness. When you pass in a obect each root style is procsesed independanlty from one another. So `test1` and `test2` are processed independantly but they are in the same set per se. `test3` and `test4` are also processed independantly but they are not in the same set as `test1` and `test2` they are in their own set.