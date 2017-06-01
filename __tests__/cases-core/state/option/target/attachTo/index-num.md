__Description__: If there is a `attachTo: <number>` key/value pair in the `option` object within a `state` object that is not on the root level and in `component` then the `state` will be attached to the index of the specified number in which `0` represents the root in the following fashion `<selector number index>:<state>` and `<selector number index>:not(:<state>)`

__Notes__

+ `0` represents the root