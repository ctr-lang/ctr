__Description__: If `$$: true` is specified ctr then assumes props in the `.ctrrc` are local-varibles, although, it will always filter out the option keys: `option`, `$ctr-option`, `ctrOption`

__Notes__

+ I didn't like having to wrap all my local-vars in `$$` nor did I think you would either so this solve that issue