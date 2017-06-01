__Description__: **public render methdod Deprecated**
In general, I think its a bad pattern and will cause more harm than good


Should be able to get the result of the last style that was rendered through `res`.

__Notes__

+ The `res` is set in the callback
+ This only gets the last style that was rendered not the set. That is if you sent through something like `{test1: {top: 0}, test2: {top: 3}}` it would process both but res would only give you `test2` if you want to capture both for some reason use the `callback`
+ In fact, thinking about this now, there really is no reason why you would want to do this, but I've typed out this much so fuck it, I'm keeping for the test stat inflation