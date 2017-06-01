__Description__: If the option `variableUpdate` is `true` then the local vars should replace themselves, as in you should be able to reffrance above Object key/values.

__Notes__

+ This could also be set via `setOption` or in the `.ctrrc` but it comes with a little perf cost, not much but its something
    - The real reason I don't have this `true` by default is becuase under more use cases (and most users) should not need to do this on a reg basis.
+ There is no garenttee this will work 100% of the time since there is no garenttee on Object order, odds are maybe 1 in 100,000 it fails, and if that is the case it allz you got to do is recompile.
