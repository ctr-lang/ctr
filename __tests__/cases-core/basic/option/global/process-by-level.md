__Description__: Should be able to change the `processBy` order, to `'level'`.

__Notes__

+ `processBy` dictates the order that the `ctr` instance is compliled
+ By default the its processed by `level` order which processes the styles by the the scope level, as in how deeply its nested
+ On the other hand, processed by `order` process the styles in the order they are recived, no exceptions, thus, `queueMedia` and such do not work
    * Don't use `processBy: 'order'` unless you know what you're doing, and why you're doing it
