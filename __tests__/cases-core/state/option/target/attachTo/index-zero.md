__Description__: If there is a `attachTo: 0` key/value pair in the `option` object within a `state` object that is not on the root level and in `component` then the `state` will be attached to the root selector in the following fashion `<root selector>:<state>` and `<root selector>:not(:<state>)`

__Notes__

+ `0`, `root`, and `true` also represents the root