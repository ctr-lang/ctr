__Description__: If the option `privateVariable` is `true` then the you can use the private var notation of `_$<var>$_`

__Notes__

+ private vars intended for CtrClasses since global vars trump local vars in classes. __BUT__ this is __NOT__ the behavior for anything else. That is local vars __alaway__ trump global vars when your create a style with `create` and the like
+ The reason I included this is due to the syntax notation, I can forsee cases in which this makes sense, just to keep all things the same
+ This could also be set via `setOption` or in the `.ctrrc` but it comes with a little perf cost, not much but its something