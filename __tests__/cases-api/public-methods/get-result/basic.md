__Description__: Should be able to output the result string with the `getResult` method. Also it should reset the set, that is once, `getResult` is called unless new `ctr` styles are added if the `getResult` was called again it would be an empty string

__Notes__

+ Alias: `getRes`
+ The reason for this "clearing-out" action is due to the nature of how you use `ctr`. For instance when your developing your styles you want leverage the caching power of a `ctr` instance. This means that you want to have a centrilized and persistant `ctr` instance as the point of interaction that collects and processes the styles. Long story short, that means we have to rebuild the set every time you save otherwise if you delete a style and we don't reset it will still be in the set and you don't want that. If that makes any sense. 

