__Description__: If a `transitions` object is comprised of children objects assume that each child object is a separate instance of a `transition`. Furthermore, if there is no `key` key/value pair specified within the `transition` child object assume the user wishes to use the object key as the `transition` selector key.


__Notes__

+ reges: `/^transitions$|^customTransitions/i`
+ All children objects of the `transition` object must be associated with transitions. For example, you cannot place a `state` object within the `transition` object
