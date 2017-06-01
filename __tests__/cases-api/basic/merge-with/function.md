__Description__: should be able to invoke Functions and deep merge their Object or Array results through `mergeWith`. `this` should be binded to the ctr ref, and the a single arg of the currnet object context should be passed.


```
mergeWith: Function || [Function, Function]
```

__Notes__

+ `mergeWith` sytax is the same as `merge` 
    - The key diffrance is that `mergeWith` merges in the var including the key while `merge` only merges the value
+ If Array, mergeing starts from 0 so lowest index always supersedes on confilcts