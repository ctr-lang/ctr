__Description__: should be able to deep merge Object vars key and values through the `mergeWith` property.

```
mergeWith: '$<var>$' || ['$<var>$', '$<var$>']
```

__Notes__

+ `mergeWith` sytax is the same as `merge` 
    - The key diffrance is that `mergeWith` merges in the var including the key while `merge` only merges the value
+ If Array, mergeing starts from 0 so lowest index always supersedes on confilcts