__Description__: If the user has a common attribute selector they wish to apply to multiple selectors the user can define a `global` object with an `option` object that has a key/value pair of `attribute: <attribute>` within the `attribute` object. This defined attribute selector will be applied to each object whose selector is defined by their object `key` 

__Notes__

+ If you use this method you must omit the brackets
+ The `global` object alias is `common`
+ The `global` object acts as expect in that anything specified will be applied to all the respected attribute instances
+ For the tests, I'm defining  the `attribute` object within an attribute `component` since attribute selectors target attributes.