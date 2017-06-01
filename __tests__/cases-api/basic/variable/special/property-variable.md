__Description__: If the option `propertyVariable` is `true` then the you can use vars for property keys and they will be replaced.

__Notes__

+ The thought, is that you could do some cool ass shit with classes with this idea
+ This could also be set via `setOption` or in the `.ctrrc` but it comes with a little perf cost, not much but its something
    - The real reason I don't have this `true` by default is becuase under more use cases (and most users) should not need to do this on a reg basis.
+ alias: `propVariable`