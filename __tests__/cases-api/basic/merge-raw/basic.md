__Description__: should be able to deep merge raw Object values through the `merge` property.

```
merge: Object || [Object, Object]
```

__Notes__

+ `merge` sytax is the same as `mergeWith` 
    - The key diffrance is that `mergeWith` merges in the var including the key while `merge` only merges the value
+ If Array, mergeing starts from 0 so lowest index always supersedes on confilcts
