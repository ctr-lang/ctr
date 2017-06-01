__Description__: The `setReset` method should reset all the "set" values

__Notes__

+ this method is REALLLY IMPORTANT particually in development
    * Why? Here is a simple example. Lets say you `setOption` with a `hover.duration` of `10s`, and everything is fine and dandy but then you decided you want to remove that option expecting it to default back to `0.5s`. So you remove it.... but alas it will persit. 
    * The reason it persitis is becuase all "set" object values are merge rather than replace (overwrite)
    * This applies to `.ctrrc` as well
+ You want to place this method at the very root of your project
    * Note, if don't plan on changing `setOption` or the `.ctrrc` during development this is not needed since
+ NOTE: ctr classes are __not__ reset becuase it doesn't really make sense to do so
+ alias: `development` 